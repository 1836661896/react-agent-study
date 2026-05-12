import { Button, Card, Form, Input, message } from "antd";

import type { Msg } from "@/types/agent";
import { useEffect, useRef, useState } from "react";
import { chatWithLocalModelStream } from "@/api/chatStream";

import "./index.scss"

export default function ChatPanel() {

  const [messages, setMessages] = useState<Msg[]>([])
  const [userText, setUserText] = useState<string>("")
  const [isStreaming, setIsStreaming] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    const el = listRef.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    return () => {
      abortRef.current?.abort()
    }
  }, [])

  async function handleSend() {
    const text = userText.trim()
    if (!text || isStreaming) return

    abortRef.current?.abort()
    abortRef.current = new AbortController()
    const signal = abortRef.current.signal

    setUserText("")
    setMessages(prev => [
      ...prev,
      { role: "user", content: text },
      { role: "assistant", content: "" }
    ])
    setIsStreaming(true)

    await chatWithLocalModelStream(
      text,
      {
        onDelta: chunk => {
          setMessages(prev => {
            const next = [...prev]
            const i = next.length - 1
            if (i >= 0 && next[i]?.role === "assistant") {
              next[i] = { ...next[i], content: next[i]?.content + chunk }
            }
            return next
          })
        },
        onDone: () => {
          setIsStreaming(false)
        },
        onError: msg => {
          message.error(msg)
          setIsStreaming(false)
          setMessages(prev => {
            const next = [...prev]
            const i = next.length - 1
            if (i >= 0 && next[i]?.role === "assistant" && next[i].content === "") {
              next[i] = { ...next[i], content: `（错误） ${msg}` }
            }
            return next
          })
        },
        onToolResult: payload => {
          // 最小：把结构化结果导到聊天里，方便联调
          setMessages(prev => [
            ...prev,
            { role: "assistant", content: `\n\n[tool_result]\n${JSON.stringify(payload, null, 2)}` }
          ])
        }
      },
      signal
    )
  }

  return (
    <div className="chat-panel-root">
      <Card title="大模型对话" className="chat-panel-card">
        <div ref={listRef} className="chat-panel-messages scrollbar-hidden">
          {messages.map((item, index) => (
            <div
              key={index}
              className={`chat-panel-row ${item.role === "assistant" ? "chat-panel-row--left" : "chat-panel-row--right"}`}
            >
              <div
                className={`messageItem ${item.role === "assistant" ? "assistantMessage" : "userMessage"}`}
              >
                {item.content}
              </div>
            </div>
          ))}
        </div>
      </Card>
      <div className="chat-panel-footer">
        <Form
          className="chat-panel-form"
          layout="inline"
          onFinish={() => {
            void handleSend()
          }}
        >
          <Form.Item className="chat-panel-form__input">
            <Input value={userText} onChange={e => setUserText(e.target.value)} placeholder="输入消息" allowClear />
          </Form.Item>
          <Form.Item className="chat-panel-form__submit">
            <Button type="primary" htmlType="submit" loading={isStreaming}>
              发送
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}