import type { ApiResponse, ListResult } from "@/types/common"
import type {
  ConversationCreateBody,
  ConversationDeleteBody,
  ConversationListItem,
  ConversationListQuery,
  ConversationMessageItem,
  ConversationMessagesQuery,
} from "@/types/conversations"
import { request } from "@/utils/request"

/** 获取会话列表 */
export function getConversationList(
  query: ConversationListQuery,
): Promise<ApiResponse<ListResult<ConversationListItem>>> {
  return request("/conversation/list", {
    method: "get",
    query
  })
}

/** 创建会话 */
export function createConversation(
  body?: ConversationCreateBody,
): Promise<ApiResponse<{ id: number }>> {
  return request("/conversation/create", {
    method: "post",
    body
  })
}

/** 删除会话 */
export function deleteConversationItems(
  body: ConversationDeleteBody,
): Promise<ApiResponse<null>> {
  return request("/conversation/delete", {
    method: "post",
    body
  })
}

/** 获取会话消息列表 */
/** conversationId 走路径；分页/role 走 query */
export function getConversationMessages(
  conversationId: number,
  query: ConversationMessagesQuery,
): Promise<ApiResponse<ListResult<ConversationMessageItem>>> {
  return request(`/conversation/${conversationId}/messages`, {
    method: "get",
    query,
  })
}
