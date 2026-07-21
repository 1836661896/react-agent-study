import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { postChatStream } from "@/api/chatStream"
import { getConversationMessages } from "@/api/conversations"
import type { ChatRouting } from "@/types/chatStream"
import type { ChatThreadPanelProps } from "./type"

/** 右侧消息区 + 「消息历史 + SSE 发送」 */
export default function ChatThreadPanel({
  conversationId,
}: ChatThreadPanelProps) {
  const hasConversation = conversationId != null // 是否有会话
  const page = 1 // 页码
  const limit = 50 // 每页条数
  const queryClient = useQueryClient()

  /** 查询消息 */
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["conversations", conversationId, "messages", page, limit],
    queryFn: () => {
      if (conversationId === null) {
        throw new Error("conversationId is required")
      }
      return getConversationMessages(conversationId, { page, limit })
    },
    enabled: hasConversation,
  })

  const [draft, setDraft] = useState("") // 草稿
  const [streaming, setStreaming] = useState(false) // 是否正在生成
  const [streamingText, setStreamingText] = useState("") // 正在生成的文本
  const [optimisticUser, setOptimisticUser] = useState<string | null>(null) // 用户发送的消息
  const [routing, setRouting] = useState<ChatRouting>("chat")

  /** 发送消息 */
  const handleSend = async () => {
    if (!hasConversation || streaming) return
    const text = draft.trim() // 消息内容
    if (!text) return // 如果消息内容为空，则不发送

    setDraft("") // 清空草稿
    setOptimisticUser(text) // 设置用户发送的消息
    setStreaming(true) // 设置正在生成
    setStreamingText("") // 清空正在生成的文本

    try {
      // 发送消息
      await postChatStream(
        {
          message: text,
          conversation_id: conversationId,
          routing,
          preset: "guide",
        },
        {
          onDelta: (chunk) => {
            setStreamingText((prev) => prev + chunk)
          },
          onError: (msg) => {
            setStreamingText((prev) => prev || msg)
          },
          onDone: () => {
            void queryClient.invalidateQueries({
              queryKey: ["conversations", conversationId, "messages"],
            })
            void queryClient.invalidateQueries({
              queryKey: ["conversations", "list"],
            })
          },
        },
      )
    } finally {
      setStreaming(false)
      setStreamingText("")
      setOptimisticUser(null)
    }
  }

  const messages = data?.data?.records ?? [] // 消息列表

  return (
    <>
      <div className="chat-page__messages">
        {!hasConversation && <div>请先选择或新建会话</div>}
        {hasConversation && isLoading && <div>消息加载中…</div>}
        {hasConversation && isError && (
          <div>
            加载失败：{error instanceof Error ? error.message : "未知错误"}
          </div>
        )}
        {hasConversation && !isLoading && !isError && messages.length === 0 && (
          <div>暂无消息，可在下方发送</div>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={`chat-page__msg chat-page__msg--${m.role}`}
          >
            <div className="chat-page__msg-role">{m.role}</div>
            <div className="chat-page__msg-content">{m.content}</div>
          </div>
        ))}
        {optimisticUser && (
          <div className="chat-page__msg chat-page__msg--user">
            <div className="chat-page__msg-role">user</div>
            <div className="chat-page__msg-content">{optimisticUser}</div>
          </div>
        )}
        {streaming && streamingText && (
          <div className="chat-page__msg chat-page__msg--assistant">
            <div className="chat-page__msg-role">assistant（生成中）</div>
            <div className="chat-page__msg-content">{streamingText}</div>
          </div>
        )}
      </div>
      <div className="chat-page__composer">
        <div className="chat-page__composer-routing">
          <label>
            <input
              type="radio"
              name="routing"
              checked={routing === "chat"}
              disabled={streaming}
              onChange={() => setRouting("chat")}
            />
            chat
          </label>
          <label>
            <input
              type="radio"
              name="routing"
              checked={routing === "auto"}
              disabled={streaming}
              onChange={() => setRouting("auto")}
            />
            auto
          </label>
        </div>
        <textarea
          className="chat-page__composer-input"
          rows={3}
          placeholder={hasConversation ? "输入消息…" : "请先选择会话"}
          disabled={!hasConversation || streaming}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
        <button
          type="button"
          disabled={!hasConversation || streaming || !draft.trim()}
          onClick={() => void handleSend()}
        >
          {streaming ? "生成中…" : "发送"}
        </button>
      </div>
    </>
  )
}
