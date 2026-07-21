import type { ChatStreamEvent, PostChatStreamBody } from "@/types/chatStream"
import { buildApiUrl } from "@/utils/url"

/** 解析单行 SSE；非 data 行或坏 JSON 返回 null */
function _parseSseDataLine(line: string): ChatStreamEvent | null {
  const trimmed = line.trimEnd()
  if (!trimmed || trimmed.startsWith(":")) return null
  if (!trimmed.startsWith("data:")) return null
  const raw = trimmed.slice("data:".length).trimStart()
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as { type?: string }
    if (!parsed || typeof parsed.type !== "string") return null
    return parsed as ChatStreamEvent
  } catch {
    return null
  }
}

/** 事件处理器类型 */
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

/** 事件分发 */
function _dispatchEvent(
  ev: ChatStreamEvent,
  handlers: ChatStreamHandlers,
): void {
  switch (ev.type) {
    case "delta":
      handlers.onDelta?.(ev.text)
      break
    case "tool_call":
      handlers.onToolCall?.({ tool: ev.tool, arguments: ev.arguments })
      break
    case "tool_result":
      handlers.onToolResult?.({
        tool: ev.tool,
        text: ev.text,
        ...(ev.is_error !== undefined ? { is_error: ev.is_error } : {}),
      })
      break
    case "error":
      handlers.onError?.(ev.msg)
      break
    case "done":
      handlers.onDone?.({
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
  handlers: ChatStreamHandlers,
  options?: { signal?: AbortSignal },
): Promise<void> {
  const routing = body.routing ?? "chat"
  const payload: Record<string, unknown> = {
    message: body.message,
    routing,
  }
  if (body.conversation_id !== undefined && body.conversation_id !== null) {
    payload.conversation_id = body.conversation_id
  }
  if (body.attachment_ids?.length) {
    payload.attachment_ids = body.attachment_ids
  }
  if (routing === "mcp") {
    if (body.mcp_tool) payload.mcp_tool = body.mcp_tool
    payload.mcp_arguments = body.mcp_arguments ?? {}
  }
  if (body.preset) {
    payload.preset = body.preset
  }

  const res = await fetch(buildApiUrl("/chat/stream"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    ...(options?.signal !== undefined ? { signal: options.signal } : {}),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(text.trim() || `HTTP ${res.status}`)
  }

  const reader = res.body?.getReader()
  if (!reader) {
    throw new Error("响应体不可读（无 body）")
  }

  /** 解码器 */
  const decoder = new TextDecoder()
  /** 缓冲区 */
  let buffer = ""
  
  /** 循环读取 */
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })

    const lines = buffer.split("\n")
    buffer = lines.pop() ?? ""

    for (const line of lines) {
      const ev = _parseSseDataLine(line)
      if (ev) _dispatchEvent(ev, handlers)
    }
  }

  /** 解码剩余数据 */
  buffer += decoder.decode()
  if (buffer) {
    for (const line of buffer.split("\n")) {
      const ev = _parseSseDataLine(line)
      if (ev) _dispatchEvent(ev, handlers)
    }
  }
}
