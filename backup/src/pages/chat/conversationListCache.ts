import type { QueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/constants/queryKeys"
import type { ApiResponse, ListResult } from "@/types/common"
import type { ConversationListItem } from "@/types/conversations"

/** 从各页 list 缓存中查找指定会话行（用于右侧标题与列表刷新后同步） */
export function findConversationRowInListCache(
  queryClient: QueryClient,
  id: number,
): ConversationListItem | null {
  const listRoot = queryKeys.conversations.listRoot()
  const entries = queryClient.getQueriesData<
    ApiResponse<ListResult<ConversationListItem>>
  >({
    predicate: (q) => {
      const key = q.queryKey
      return (
        Array.isArray(key) &&
        key[0] === listRoot[0] &&
        key[1] === listRoot[1]
      )
    },
  })
  for (const [, envelope] of entries) {
    const records = envelope?.data?.records ?? []
    const row = records.find((r) => r.id === id)
    if (row) return row
  }
  return null
}
