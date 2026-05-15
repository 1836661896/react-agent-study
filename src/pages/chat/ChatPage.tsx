import ConversationList from "@/pages/chat/components/ConversationList"
import type { ConversationListItem } from "@/types/conversations"
import { Col, Row } from "antd"
import { useState } from "react"
import ChatThreadPanel from "./components/ChatThreadPanel"

export default function ChatPage() {
  const [selectedItem, setSelectedItem] = useState<ConversationListItem | null>(null)

  return (
    <Row gutter={16} style={{padding: 16}}>
      <Col xs={24} md={10} lg={8}>
        <ConversationList
          selectedId={selectedItem?.id ?? null}
          onSelectConversation={setSelectedItem}
        />
      </Col>
      <Col xs={24} md={14} lg={16}>
        <ChatThreadPanel conversation={selectedItem} />
      </Col>
    </Row>
  )
}
