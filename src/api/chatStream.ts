import { env } from "@/config/env";

function buildUrl(path: string) {
  const base = env.apiBaseUrl.replace(/\/$/, "")
  const p = path.startsWith("/") ? path : `/${path}`
  return `${base}${p}`
}

export type ChatStreamHandlers = {
  onDelta: (text: string) => void
  onDone: () => void
  onError: (msg: string) => void
  onToolResult?: (payload: any) => void
}

type SsePayload =
  | { type: "delta"; text: string }
  | { type: "done" }
  | { type: "error"; msg: string;[k: string]: any }
  | { type: "tool_result";[k: string]: any }


function parseDataLine(line: string): SsePayload | null {
  const trimmed = line.trim()
  if (!trimmed.startsWith("data:")) return null
  const jsonStr = trimmed.slice(5).trim()
  if (!jsonStr) return null
  try {
    return JSON.parse(jsonStr) as SsePayload
  } catch {
    return null
  }
}

/** 处理一段可能含多行的 SSE 缓冲，返回是否已收到 done / error（应停止读流） */
function consumeSseBuffer(
  buffer: string,
  handlers: ChatStreamHandlers
): { rest: string; finished: boolean } {
  const parts = buffer.split("\n\n")
  const rest = parts.pop() ?? ""
  let finished = false

  for (const rawBlock of parts) {
    const lines = rawBlock.split(/\r?\n/)
    for (const line of lines) {
      const obj = parseDataLine(line)
      if (!obj) continue
      if (obj.type === "delta" && typeof obj.text === "string" && obj.text.length > 0) {
        handlers.onDelta(obj.text)
      } else if (obj.type === "done") {
        handlers.onDone()
        finished = true
      } else if (obj.type === "tool_result") {
        handlers.onToolResult?.(obj)
      } else if (obj.type === "error" && typeof obj.msg === "string") {
        handlers.onError(obj.msg)
        finished = true
      }
    }
  }

  return { rest, finished }
}

/**
 * POST /chat/stream，SSE：data: JSON，type 为 delta | done | error
 */
export async function chatWithLocalModelStream(
  message: string,
  handlers: ChatStreamHandlers,
  signal?: AbortSignal
): Promise<void> {
  const url = buildUrl("chat/stream")
  let res: Response
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
      signal: signal ?? null
    })
  } catch (e) {
    if (e instanceof DOMException && e.name === "AbortError") return
    handlers.onError(e instanceof Error ? e.message : "网络异常")
    return
  }

  if (!res.ok) {
    handlers.onError(`请求失败（HTTP ${res.status}）`)
    return
  }

  const body = res.body
  if (!body) {
    handlers.onError("响应体为空")
    return
  }

  const reader = body.getReader()
  const decoder = new TextDecoder()
  let buffer = ""

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      const { rest, finished } = consumeSseBuffer(buffer, handlers)
      buffer = rest
      if (finished) return
    }

    if (buffer.trim()) {
      const { finished } = consumeSseBuffer(buffer + "\n\n", handlers)
      if (!finished) handlers.onDone()
    } else {
      handlers.onDone()
    }
  } catch (e) {
    if (e instanceof DOMException && e.name === "AbortError") return
    handlers.onError(e instanceof Error ? e.message : "读取流失败")
  }
  finally {
    reader.releaseLock()
  }
}