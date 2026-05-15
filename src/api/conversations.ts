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

// 获取会话列表
export function getConversationList(
  query: ConversationListQuery,
): Promise<ApiResponse<ListResult<ConversationListItem>>> {
  return request<ApiResponse<ListResult<ConversationListItem>>>(
    "conversation/list",
    {
      method: "get",
      query: {
        kind: query.kind,
        page: query.page,
        limit: query.limit,
      },
    },
  )
}

// 删除会话
export function deleteConversationItems(
  body: ConversationDeleteBody,
): Promise<ApiResponse<null>> {
  return request<ApiResponse<null>>("conversation/delete", {
    method: "post",
    body: {
      ids: body.ids,
    },
  })
}

// 获取会话消息
export function getConversationMessages(
  query: ConversationMessagesQuery,
): Promise<ApiResponse<ListResult<ConversationMessageItem>>> {
  return request<ApiResponse<ListResult<ConversationMessageItem>>>(
    `conversation/${query.conversation_id}/messages`,
    {
      method: "get",
      query: {
        page: query.page,
        limit: query.limit,
        role: query.role,
      },
    },
  )
}

//
export function createConversation(
  body?: ConversationCreateBody,
): Promise<ApiResponse<{ id: number }>> {
  return request("conversation/create", {
    method: "post",
    body: body ?? {},
  })
}
