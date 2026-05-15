import type { ListQuery } from "./common"

// 会话类型
export type ConversationKind = "chat" | "mcp" | "plan"

// 会话列表查询参数
export interface ConversationListQuery extends ListQuery {
  kind?: ConversationKind
}

// 会话列表项
export type ConversationListItem = {
  id: number
  kind: ConversationKind
  memory_title: string
  created_at?: string
  memory_updated_at?: string | null
}

// 会话删除查询参数
export type ConversationDeleteBody = {
  ids: number[]
}

// 消息角色
export type MessageRole = "user" | "assistant" | "system"

// 会话消息查询参数
export interface ConversationMessagesQuery extends ListQuery {
  conversation_id: number
  role?: MessageRole
}

// 会话消息项
export type ConversationMessageItem = {
  id: number
  conversation_id: number
  role: MessageRole
  content: string
  turn_id: string
  created_at: string
  meta: Record<string, unknown>
}

// 新建会话请求体
export type ConversationCreateBody = {
  kind?: ConversationKind
}
