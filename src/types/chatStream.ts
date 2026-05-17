export type RoutingMode = "auto" | "chat" | "mcp" | "plan"

export type ChatStreamSseEvent =
  | { type: "delta"; text: string }
  | { type: "tool_call"; tool: string; arguments: Record<string, unknown> }
  | { type: "tool_result"; tool: string; text: string; is_error?: boolean }
  | { type: "error"; msg: string }
  | { type: "done"; conversation_id: number | null; turn_id: string }

export type ChatStreamSseEventType = ChatStreamSseEvent["type"]

export type PostChatStreamBody = {
  message: string
  conversation_id: number | null
  routing?: RoutingMode
  mcp_tool?: string | null
  mcp_arguments?: Record<string, unknown>
}
