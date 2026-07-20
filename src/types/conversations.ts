import type { ListQuery } from "./common"

// 会话类型
export type ConversationKind = "chat" | "mcp" | "plan"

// 会话列表查询
export type ConversationListQuery = ListQuery & {
  kind?: ConversationKind
}

// 会话列表项
export type ConversationListItem = {
  id: number
  kind: ConversationKind
  memory_title: string
  created_at: string
  updated_at: string
}

// 删除会话请求体
export type ConversationDeleteBody = {
  ids: number[]
}

// 创建会话请求体
export type ConversationCreateBody = {
  kind?: ConversationKind
}

// 消息角色
export type MessageRole = "user" | "assistant" | "system"

// 消息列表查询
export type ConversationMessagesQuery = ListQuery & {
  role?: MessageRole
}

/** 消息上的附件（通常挂在 user 消息） */
export type MessageAttachmentItem = {
  artifact_id: string
  filename: string
  mime_type: string
  size_bytes: number
  url: string
}

// 消息列表项
export type ConversationMessageItem = {
  id: number
  conversation_id: number
  role: MessageRole
  content: string
  turn_id: string
  meta: Record<string, unknown>
  created_at: string
  attachments: MessageAttachmentItem[]
}
