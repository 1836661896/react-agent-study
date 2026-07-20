/**
 * /chat 路由页面：左栏会话列表 + 右栏消息与发送区。
 * 选中会话由本页 state 持有，避免列表分页后丢失当前选中行的展示上下文。
 */
import "./index.scss"
import { useQueryClient } from "@tanstack/react-query"
import { Col, Row } from "antd"
import { useEffect, useState } from "react"
import type { AgentPreset } from "@/types/chatStream"
import type { ConversationListItem } from "@/types/conversations"
import ChatThreadPanel from "./ChatThreadPanel"
import ConversationList from "./ConversationList"
import { findConversationRowInListCache } from "./conversationListCache"

export default function ChatPage() {
  const queryClient = useQueryClient()
  const [selectedItem, setSelectedItem] = useState<ConversationListItem | null>(
    null,
  )
  const [presetByConvId, setPresetByConvId] = useState<
    Record<number, AgentPreset>
  >({})

  const activePreset =
    selectedItem != null ? (presetByConvId[selectedItem.id] ?? null) : null

  function markScheduleSession(id: number) {
    setPresetByConvId((prev) => ({ ...prev, [id]: "schedule" }))
  }

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
          (prev.memory_updated_at ?? null) ===
            (fresh.memory_updated_at ?? null) &&
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
  }, [queryClient, selectedItem?.id, selectedItem])

  return (
    <div className="chat-page">
      <Row gutter={16} className="chat-page__row">
        <Col xs={24} md={10} lg={8} className="chat-page__col">
          <ConversationList
            selectedId={selectedItem?.id ?? null}
            onSelectConversation={setSelectedItem}
            onScheduleSessionCreated={markScheduleSession}
          />
        </Col>
        <Col xs={24} md={14} lg={16} className="chat-page__col">
          <ChatThreadPanel conversation={selectedItem} preset={activePreset} />
        </Col>
      </Row>
    </div>
  )
}
