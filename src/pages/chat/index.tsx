import "./index.scss"
import { useState } from "react"
import ChatThreadPanel from "./ChatThreadPanel"
import ConversationList from "./ConversationList"

export default function ChatPage() {
  const [selectedId, setSelectedId] = useState<number | null>(null)

  return (
    <div className="chat-page">
      <aside className="chat-page__sidebar">
        <ConversationList
          selectedId={selectedId}
          onSelectConversation={(item) => setSelectedId(item?.id ?? null)}
        />
      </aside>

      <section className="chat-page__main">
        <ChatThreadPanel conversationId={selectedId} />
      </section>
    </div>
  )
}
