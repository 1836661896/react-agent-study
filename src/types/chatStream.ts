// 路由模式
export type RoutingMode = "auto" | "chat" | "mcp" | "plan"

// 助手预设
export type AgentPreset = "schedule"

// SSE 事件类型
export type ChatStreamSseEvent =
  | { type: "delta"; text: string }
  | { type: "tool_call"; tool: string; arguments: Record<string, unknown> }
  | { type: "tool_result"; tool: string; text: string; is_error?: boolean }
  | { type: "error"; msg: string }
  | { type: "done"; conversation_id: number | null; turn_id: string }

// SSE 事件类型
export type ChatStreamSseEventType = ChatStreamSseEvent["type"]

// 发送请求体
export type PostChatStreamBody = {
  message: string
  conversation_id: number | null
  routing?: RoutingMode
  preset?: AgentPreset | null
  mcp_tool?: string | null
  mcp_arguments?: Record<string, unknown>
}
