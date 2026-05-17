/**
 * 右侧会话线程：消息历史（无限滚动向前翻页）、SSE 流式展示、发送区。
 * 与 antd Card 配套的 flex 样式在 index.scss，通过类名绑定。
 *
 * 发送体验：用户消息乐观插入；模式仅「自动 / 对话」（MCP 由 auto 路由或后续能力按钮触发）；
 * 工具调用过程用 toolTrace 展示；首段 delta 前展示「正在思考…」；流式时贴底滚动。
 */
import "./index.scss"
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query"
import {
  Alert,
  Button,
  Card,
  Empty,
  Input,
  message,
  Segmented,
  Space,
  Spin,
  Tag,
  Typography,
} from "antd"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { postChatStream } from "@/api/chatStream"
import { getConversationMessages } from "@/api/conversations"
import type { RoutingMode } from "@/types/chatStream"
import type { ConversationListItem } from "@/types/conversations"
import { errorDescription } from "@/utils/common"
import { formatDisplayDateTime } from "@/utils/datetime"

const MESSAGES_PAGE_SIZE = 50

/** 用户可选的对话模式；MCP 由 auto 或后续「能力按钮」触发，不在此暴露 */
type ChatUiRoutingMode = Extract<RoutingMode, "auto" | "chat">

const ROUTING_OPTIONS: { label: string; value: ChatUiRoutingMode }[] = [
  { label: "自动", value: "auto" },
  { label: "对话", value: "chat" },
]

type ChatThreadPanelProp = {
  conversation: ConversationListItem | null
}

/** 乐观展示用：尚未写入服务端列表的用户气泡 */
type OptimisticUserBubble = {
  key: string
  content: string
}

type ToolTrace = {
  tool: string
  phase: "calling" | "result"
  arguments?: Record<string, unknown>
  resultText?: string
  isError?: boolean
}

function conversationPanelTitle(item: ConversationListItem): string {
  const t = item.memory_title?.trim()
  return t ? t : `会话 ${item.id}`
}

export default function ChatThreadPanel({ conversation }: ChatThreadPanelProp) {
  const queryClient = useQueryClient()
  const scrollRef = useRef<HTMLDivElement>(null)
  const convId = conversation?.id ?? 0

  const messageQuery = useInfiniteQuery({
    queryKey: [
      "conversations",
      "messages",
      "infinite",
      convId,
      MESSAGES_PAGE_SIZE,
    ] as const,
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      getConversationMessages({
        conversation_id: convId!,
        page: pageParam,
        limit: MESSAGES_PAGE_SIZE,
      }),
    enabled: conversation !== null,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      const list = lastPage.data
      if (!list?.records) return undefined
      const fetched = allPages.reduce(
        (acc, p) => acc + (p.data?.records?.length ?? 0),
        0,
      )
      if (fetched >= list.total) return undefined
      if (list.records.length < MESSAGES_PAGE_SIZE) return undefined
      return lastPageParam + 1
    },
    staleTime: 5_000,
  })

  /** API 分页顺序与 UI 时间序可能不一致，合并后按 created_at 排序一次 */
  const ordered = useMemo(() => {
    const raw =
      messageQuery.data?.pages.flatMap((p) => p.data?.records ?? []) ?? []
    return [...raw].sort((a, b) => a.id - b.id)
  }, [messageQuery.data])

  const [draft, setDraft] = useState("")
  const [streaming, setStreaming] = useState(false)
  const [streamingText, setStreamingText] = useState("")
  const [optimisticUser, setOptimisticUser] =
    useState<OptimisticUserBubble | null>(null)
  const [routing, setRouting] = useState<ChatUiRoutingMode>("auto")
  const [toolTrace, setToolTrace] = useState<ToolTrace | null>(null)

  const scrollToBottom = useCallback(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [])

  /** 切换会话时滚到底部，便于直接看到最新消息 */
  useEffect(() => {
    const el = scrollRef.current
    if (!el || conversation === null) return
    setToolTrace(null)
    el.scrollTop = el.scrollHeight
  }, [conversation?.id, conversation])

  /** 流式输出过程中随内容增高贴底（加载更早历史不应触发，故不监听 ordered） */
  useEffect(() => {
    if (!streaming) return
    scrollToBottom()
  }, [streaming, scrollToBottom])

  /** 乐观用户气泡插入后贴底 */
  useEffect(() => {
    if (!optimisticUser) return
    requestAnimationFrame(() => scrollToBottom())
  }, [optimisticUser?.key, scrollToBottom, optimisticUser])

  /**
   * 加载更早一页后恢复视口锚点：避免用户正在读的内容被突然顶下去。
   * 通过「增加的高度差 + 原 scrollTop」修正 scrollTop。
   */
  const loadOlder = useCallback(async () => {
    const el = scrollRef.current
    if (!el || !messageQuery.hasNextPage || messageQuery.isFetchingNextPage)
      return
    const prevHeight = el.scrollHeight
    const prevTop = el.scrollTop
    await messageQuery.fetchNextPage()
    requestAnimationFrame(() => {
      const el2 = scrollRef.current
      if (!el2) return
      el2.scrollTop = el2.scrollHeight - prevHeight + prevTop
    })
  }, [messageQuery])

  /** 接近顶部时自动拉取上一页（与顶部「加载更多」按钮二选一也可，当前两者并存） */
  function onScrollAreaScroll() {
    const el = scrollRef.current
    if (!el) return
    if (!messageQuery.hasNextPage || messageQuery.isFetchingNextPage) return
    if (el.scrollHeight <= el.clientHeight + 80) return
    if (el.scrollTop > 80) return
    void loadOlder()
  }

  async function handleSend() {
    const text = draft.trim()
    if (!conversation || !text || streaming) return

    setDraft("")
    setStreaming(true)
    setStreamingText("")
    setToolTrace(null)
    setOptimisticUser({
      key: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      content: text,
    })
    requestAnimationFrame(() => scrollToBottom())

    try {
      await postChatStream(
        {
          message: text,
          conversation_id: convId,
          routing,
        },
        {
          onToolCall: ({ tool, arguments: args }) => {
            setToolTrace({
              tool,
              phase: "calling",
              arguments: args,
            })
            requestAnimationFrame(() => scrollToBottom())
          },
          onToolResult: ({ tool, text: resultText, is_error }) => {
            setToolTrace({
              tool,
              phase: "result",
              resultText,
              ...(is_error !== undefined ? { isError: is_error } : {}),
            })
            requestAnimationFrame(() => scrollToBottom())
          },
          onDelta: (t) => setStreamingText((s) => s + t),
          onError: (m) => {
            void message.error(m)
            setStreaming(false)
            setStreamingText("")
            setToolTrace(null)
            setOptimisticUser(null)
          },
          onDone: async () => {
            await queryClient.invalidateQueries({
              queryKey: ["conversations", "messages", "infinite", convId],
            })
            await queryClient.invalidateQueries({
              queryKey: ["conversations", "list"],
            })
            setStreamingText("")
            setToolTrace(null)
            setStreaming(false)
            setOptimisticUser(null)
            requestAnimationFrame(() => scrollToBottom())
          },
        },
      )
    } catch (e) {
      message.error(e instanceof Error ? e.message : "发送失败")
      setStreaming(false)
      setStreamingText("")
      setToolTrace(null)
      setOptimisticUser(null)
    }
  }

  const hasThreadContent =
    ordered.length > 0 ||
    optimisticUser !== null ||
    streaming ||
    streamingText !== "" ||
    toolTrace !== null

  const showEmptyHint =
    !messageQuery.isError &&
    ordered.length === 0 &&
    optimisticUser === null &&
    !streaming &&
    streamingText === ""

  if (conversation === null) {
    return (
      <Card
        className="chat-thread-panel chat-thread-panel--placeholder"
        title="会话内容"
      >
        <Empty description="请在左侧选择一个会话或创建新会话" />
      </Card>
    )
  }

  return (
    <Card
      className="chat-thread-panel"
      title={conversationPanelTitle(conversation)}
      extra={
        <Space size="small" wrap>
          <Tag>{conversation.kind}</Tag>
          <Typography.Text
            type="secondary"
            className="chat-thread-panel__meta-small"
          >
            id: {conversation.id}
          </Typography.Text>
        </Space>
      }
    >
      {messageQuery.isError ? (
        <Alert
          type="error"
          showIcon
          title="消息加载失败"
          description={errorDescription(messageQuery.error)}
          action={
            <Typography.Link onClick={() => messageQuery.refetch()}>
              重试
            </Typography.Link>
          }
        />
      ) : null}

      <div className="chat-thread-panel__main-column">
        <div
          ref={scrollRef}
          className="chat-thread-panel__scroll"
          onScroll={onScrollAreaScroll}
        >
          {messageQuery.hasNextPage ? (
            <div className="chat-thread-panel__load-more-wrap">
              <Button
                type="link"
                size="small"
                loading={messageQuery.isFetchingNextPage}
                onClick={() => void loadOlder()}
              >
                {messageQuery.isFetchingNextPage
                  ? "加载中……"
                  : "加载更多历史记录"}
              </Button>
            </div>
          ) : null}

          {showEmptyHint ? <Empty description="该会话暂无消息" /> : null}

          <Spin spinning={messageQuery.isPending}>
            {!messageQuery.isError && hasThreadContent ? (
              <>
                {ordered.length > 0 ? (
                  <Space
                    orientation="vertical"
                    size="small"
                    className="chat-thread-panel__msg-list"
                  >
                    {ordered.map((m) => (
                      <div
                        key={m.id}
                        className={
                          m.role === "user"
                            ? "chat-thread-panel__msg-row chat-thread-panel__msg-row--user"
                            : "chat-thread-panel__msg-row chat-thread-panel__msg-row--assistant"
                        }
                      >
                        <Card
                          size="small"
                          className={
                            m.role === "user"
                              ? "chat-thread-panel__bubble chat-thread-panel__bubble--user"
                              : "chat-thread-panel__bubble"
                          }
                        >
                          <Space
                            orientation="vertical"
                            size={0}
                            className="chat-thread-panel__bubble-inner"
                          >
                            <Space size="small">
                              <Tag>{m.role}</Tag>
                              <Typography.Text
                                type="secondary"
                                className="chat-thread-panel__meta-time"
                              >
                                {formatDisplayDateTime(m.created_at)}
                              </Typography.Text>
                            </Space>
                            <Typography.Paragraph className="chat-thread-panel__msg-content">
                              {m.content}
                            </Typography.Paragraph>
                          </Space>
                        </Card>
                      </div>
                    ))}
                  </Space>
                ) : null}

                {optimisticUser ? (
                  <div
                    className={
                      ordered.length > 0
                        ? "chat-thread-panel__msg-row chat-thread-panel__msg-row--user chat-thread-panel__msg-row--spaced"
                        : "chat-thread-panel__msg-row chat-thread-panel__msg-row--user"
                    }
                  >
                    <Card
                      size="small"
                      className="chat-thread-panel__bubble chat-thread-panel__bubble--user"
                    >
                      <Space
                        orientation="vertical"
                        size={0}
                        className="chat-thread-panel__bubble-inner"
                      >
                        <Space size="small">
                          <Tag>user</Tag>
                          <Typography.Text
                            type="secondary"
                            className="chat-thread-panel__meta-time"
                          >
                            发送中
                          </Typography.Text>
                        </Space>
                        <Typography.Paragraph className="chat-thread-panel__msg-content">
                          {optimisticUser.content}
                        </Typography.Paragraph>
                      </Space>
                    </Card>
                  </div>
                ) : null}

                {toolTrace ? (
                  <div className="chat-thread-panel__streaming-row">
                    <Alert
                      type={toolTrace.isError ? "error" : "info"}
                      showIcon
                      title={
                        toolTrace.phase === "calling"
                          ? `正在调用工具：${toolTrace.tool}`
                          : `工具返回：${toolTrace.tool}`
                      }
                      description={
                        toolTrace.phase === "calling" ? (
                          <Typography.Text
                            type="secondary"
                            className="chat-thread-panel__tool-args"
                          >
                            {JSON.stringify(toolTrace.arguments ?? {})}
                          </Typography.Text>
                        ) : (
                          <Typography.Paragraph className="chat-thread-panel__msg-content">
                            {toolTrace.resultText}
                          </Typography.Paragraph>
                        )
                      }
                    />
                  </div>
                ) : null}
                {streaming && !streamingText && !toolTrace ? (
                  <div className="chat-thread-panel__streaming-row">
                    <Card size="small" className="chat-thread-panel__bubble">
                      <Space size="small" align="center">
                        <Spin size="small" />
                        <Typography.Text
                          type="secondary"
                          className="chat-thread-panel__typing-hint"
                        >
                          正在思考…
                        </Typography.Text>
                      </Space>
                    </Card>
                  </div>
                ) : null}

                {streamingText ? (
                  <div className="chat-thread-panel__streaming-row">
                    <Card size="small" className="chat-thread-panel__bubble">
                      <Tag>assistant</Tag>
                      <Typography.Paragraph className="chat-thread-panel__msg-content">
                        {streamingText}
                      </Typography.Paragraph>
                    </Card>
                  </div>
                ) : null}
              </>
            ) : null}
          </Spin>
        </div>

        <div className="chat-thread-panel__composer">
          <Space orientation="vertical" size="small" style={{ width: "100%" }}>
            <Segmented
              size="small"
              options={ROUTING_OPTIONS}
              value={routing}
              onChange={(v) => setRouting(v as ChatUiRoutingMode)}
              disabled={streaming}
            />
          </Space>
          <Space.Compact className="chat-thread-panel__composer-inner">
            <Input.TextArea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="输入消息， Enter 发送（Shift+Enter 换行）"
              autoSize={{ minRows: 1, maxRows: 4 }}
              disabled={streaming}
              onPressEnter={(e) => {
                if (!e.shiftKey) {
                  e.preventDefault()
                  void handleSend()
                }
              }}
            />
            <Button
              type="primary"
              disabled={streaming || !draft.trim()}
              onClick={() => void handleSend()}
            >
              发送
            </Button>
          </Space.Compact>
        </div>
      </div>
    </Card>
  )
}
