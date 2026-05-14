import type { ApiResponse, ListResult } from "@/types/common"
import type {
  ConversationDeleteBody,
  ConversationListItem,
  ConversationListQuery,
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
