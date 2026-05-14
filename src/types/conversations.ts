import type { ListQuery } from "./common"

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
  created_at: string
  memory_updated_at?: string | null
}

// 会话删除查询参数
export type ConversationDeleteBody = {
  ids: number[]
}
