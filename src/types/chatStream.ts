/** 日常默认 chat；auto/mcp 已通；plan 占位 */
export type ChatRouting = "chat" | "auto" | "mcp" | "plan"

// 发送聊天消息请求体
export type PostChatStreamBody = {
  message?: string
  conversation_id?: number
  /** 默认不传则后端按 chat；前端日常发送建议显式或省略均可，api 层可默认 chat */
  routing?: ChatRouting
  preset?: string
  /** 先 POST /artifact，再把 id 挂上；与 message 不可同时为空 */
  attachment_ids?: string[]
  mcp_tool?: string
  mcp_arguments?: Record<string, unknown>
}

// 聊天消息 delta 事件
export type ChatStreamDeltaEvent = {
  type: "delta"
  text: string
}

// 聊天消息错误事件
export type ChatStreamErrorEvent = {
  type: "error"
  msg: string
}

// 聊天消息完成事件
export type ChatStreamDoneEvent = {
  type: "done"
  conversation_id: number | null
  turn_id: string
}

// 聊天消息工具调用事件
export type ChatStreamToolCallEvent = {
  type: "tool_call"
  tool: string
  arguments: Record<string, unknown>
}

// 聊天消息工具结果事件
export type ChatStreamToolResultEvent = {
  type: "tool_result"
  tool: string
  text: string
  is_error?: boolean
}

// 聊天消息事件
export type ChatStreamEvent =
  | ChatStreamDeltaEvent
  | ChatStreamErrorEvent
  | ChatStreamDoneEvent
  | ChatStreamToolCallEvent
  | ChatStreamToolResultEvent
