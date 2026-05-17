import { env } from "@/config/env"
import type { ChatStreamSseEvent, PostChatStreamBody } from "@/types/chatStream"

function _buildAbsoluteUrl(path: string): string {
  const base = env.apiBaseUrl.replace(/\/$/, "")
  const p = path.startsWith("/") ? path : `/${path}`
  return `${base}${p}`
}

function _parseSseDataLine(line: string): ChatStreamSseEvent | null {
  const trimmed = line.trimEnd()
  if (!trimmed || trimmed.startsWith(":")) return null
  if (!trimmed.startsWith("data:")) return null
  const raw = trimmed.slice("data:".length).trimStart()
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as { type?: string }
    if (!parsed || typeof parsed.type !== "string") return null
    return parsed as ChatStreamSseEvent
  } catch {
    return null
  }
}

export type ChatStreamHandlers = {
  onDelta?: (text: string) => void
  onToolCall?: (payload: {
    tool: string
    arguments: Record<string, unknown>
  }) => void
  onToolResult?: (payload: {
    tool: string
    text: string
    is_error?: boolean
  }) => void
  onError?: (msg: string) => void
  onDone?: (payload: {
    conversation_id: number | null
    turn_id: string
  }) => void
}

function _dispatchEvent(
  ev: ChatStreamSseEvent,
  _handlers: ChatStreamHandlers,
): void {
  switch (ev.type) {
    case "delta":
      _handlers.onDelta?.(ev.text)
      break
    case "tool_call":
      _handlers.onToolCall?.({ tool: ev.tool, arguments: ev.arguments })
      break
    case "tool_result":
      _handlers.onToolResult?.({
        tool: ev.tool,
        text: ev.text,
        ...(ev.is_error !== undefined ? { is_error: ev.is_error } : {}),
      })
      break
    case "error":
      _handlers.onError?.(ev.msg)
      break
    case "done":
      _handlers.onDone?.({
        conversation_id: ev.conversation_id,
        turn_id: ev.turn_id,
      })
      break
    default: {
      const _exhaustive: never = ev
      void _exhaustive
      break
    }
  }
}

export async function postChatStream(
  body: PostChatStreamBody,
  _handlers: ChatStreamHandlers,
  options?: { signal?: AbortSignal },
): Promise<void> {
  const routing = body.routing ?? "auto"
  const payload: Record<string, unknown> = {
    message: body.message,
    routing,
  }
  if (body.conversation_id !== undefined && body.conversation_id !== null) {
    payload.conversation_id = body.conversation_id
  }
  if (routing === "mcp") {
    if (body.mcp_tool) payload.mcp_tool = body.mcp_tool
    payload.mcp_arguments = body.mcp_arguments ?? {}
  }

  const _res = await fetch(_buildAbsoluteUrl("/chat/stream"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    ...(options?.signal !== undefined ? { signal: options.signal } : {}),
  })

  if (!_res.ok) {
    const text = await _res.text().catch(() => "")
    throw new Error(text.trim() || `HTTP ${_res.status}`)
  }

  const reader = _res.body?.getReader()
  if (!reader) {
    throw new Error("响应体不可读（无 body）")
  }

  const decoder = new TextDecoder()
  let buffer = ""

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })

    const lines = buffer.split("\n")
    buffer = lines.pop() ?? ""

    for (const line of lines) {
      const ev = _parseSseDataLine(line)
      if (ev) _dispatchEvent(ev, _handlers)
    }
  }

  buffer += decoder.decode()
  if (buffer) {
    for (const line of buffer.split("\n")) {
      const ev = _parseSseDataLine(line)
      if (ev) _dispatchEvent(ev, _handlers)
    }
  }
}
