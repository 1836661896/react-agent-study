/**
 * /chat 路由页面：左栏会话列表 + 右栏消息与发送区。
 * 选中会话由本页 state 持有，避免列表分页后丢失当前选中行的展示上下文。
 */
import { useQueryClient, type QueryClient } from "@tanstack/react-query"
import { Col, Row } from "antd"
import { useEffect, useState } from "react"
import type { ApiResponse, ListResult } from "@/types/common"
import type { ConversationListItem } from "@/types/conversations"
import ChatThreadPanel from "./ChatThreadPanel/index"
import ConversationList from "./ConversationList/index"
import "./index.scss"

function findConversationRowInListCache(
  queryClient: QueryClient,
  id: number,
): ConversationListItem | null {
  const entries = queryClient.getQueriesData<
    ApiResponse<ListResult<ConversationListItem>>
  >({
    predicate: (q) =>
      Array.isArray(q.queryKey) &&
      q.queryKey[0] === "conversations" &&
      q.queryKey[1] === "list",
  })
  for (const [, envelope] of entries) {
    const records = envelope?.data?.records ?? []
    const row = records.find((r) => r.id === id)
    if (row) return row
  }
  return null
}

export default function ChatPage() {
  const queryClient = useQueryClient()
  // 当前选中的会话（整行快照传给右侧，列表项字段即可渲染标题等）
  const [selectedItem, setSelectedItem] = useState<ConversationListItem | null>(
    null,
  )

  /** 列表缓存刷新后，用各页中的最新行合并 memory_title 等，避免右侧标题停留在旧快照 */
  useEffect(() => {
    if (selectedItem == null) return
    const id = selectedItem.id

    function syncFromListCache() {
      const fresh = findConversationRowInListCache(queryClient, id)
      if (!fresh) return
      setSelectedItem((prev) => {
        if (!prev || prev.id !== id) return prev
        if (
          prev.memory_title === fresh.memory_title &&
          (prev.memory_updated_at ?? null) === (fresh.memory_updated_at ?? null) &&
          prev.kind === fresh.kind
        ) {
          return prev
        }
        return fresh
      })
    }

    syncFromListCache()
    return queryClient.getQueryCache().subscribe(() => {
      syncFromListCache()
    })
  }, [queryClient, selectedItem?.id])

  return (
    <div className="chat-page">
      <Row gutter={16} className="chat-page__row">
        {/* 左侧：列表与分页；响应式小屏占满一行 */}
        <Col xs={24} md={10} lg={8} className="chat-page__col">
          <ConversationList
            selectedId={selectedItem?.id ?? null}
            onSelectConversation={setSelectedItem}
          />
        </Col>
        {/* 右侧：历史消息、流式增量、输入框 */}
        <Col xs={24} md={14} lg={16} className="chat-page__col">
          <ChatThreadPanel conversation={selectedItem} />
        </Col>
      </Row>
    </div>
  )
}
