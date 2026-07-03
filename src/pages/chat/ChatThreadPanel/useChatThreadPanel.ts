import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query"
import { message } from "antd"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { postChatStream } from "@/api/chatStream"
import { getConversationMessages } from "@/api/conversations"
import { queryKeys } from "@/constants/queryKeys"
import type { ConversationListItem } from "@/types/conversations"
import { parseArtifactIdFromToolResult } from "@/utils/artifactParse"
import type {
  ChatUiRoutingMode,
  OptimisticUserBubble,
  ToolTrace,
  UseChatThreadPanelParams,
} from "./type"

const MESSAGES_PAGE_SIZE = 50

export function conversationPanelTitle(item: ConversationListItem): string {
  const t = item.memory_title?.trim()
  return t ? t : `会话 ${item.id}`
}

export function useChatThreadPanel({
  conversation,
  preset,
}: UseChatThreadPanelParams) {
  const queryClient = useQueryClient()
  const scrollRef = useRef<HTMLDivElement>(null)
  const convId = conversation?.id ?? 0

  const messageQuery = useInfiniteQuery({
    queryKey: queryKeys.conversations.messagesInfinite(
      convId,
      MESSAGES_PAGE_SIZE,
    ),
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

  useEffect(() => {
    const el = scrollRef.current
    if (!el || conversation === null) return
    setToolTrace(null)
    el.scrollTop = el.scrollHeight
  }, [conversation?.id, conversation])

  useEffect(() => {
    if (!streaming) return
    scrollToBottom()
  }, [streaming, scrollToBottom])

  useEffect(() => {
    if (!optimisticUser) return
    requestAnimationFrame(() => scrollToBottom())
  }, [optimisticUser?.key, scrollToBottom, optimisticUser])

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

  const onScrollAreaScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    if (!messageQuery.hasNextPage || messageQuery.isFetchingNextPage) return
    if (el.scrollHeight <= el.clientHeight + 80) return
    if (el.scrollTop > 80) return
    void loadOlder()
  }, [loadOlder, messageQuery.hasNextPage, messageQuery.isFetchingNextPage])

  const handleSend = useCallback(async () => {
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
          ...(preset ? { preset } : {}),
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
            const artifactId = parseArtifactIdFromToolResult(resultText)
            setToolTrace({
              tool,
              phase: "result",
              resultText,
              ...(is_error !== undefined ? { isError: is_error } : {}),
              ...(artifactId ? { artifactId } : {}),
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
              queryKey: queryKeys.conversations.messagesInfinite(
                convId,
                MESSAGES_PAGE_SIZE,
              ),
            })
            await queryClient.invalidateQueries({
              queryKey: queryKeys.conversations.listRoot(),
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
  }, [
    conversation,
    convId,
    draft,
    preset,
    queryClient,
    routing,
    scrollToBottom,
    streaming,
  ])

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

  return {
    scrollRef,
    messageQuery,
    ordered,
    draft,
    setDraft,
    streaming,
    streamingText,
    optimisticUser,
    routing,
    setRouting,
    toolTrace,
    loadOlder,
    onScrollAreaScroll,
    handleSend,
    hasThreadContent,
    showEmptyHint,
  }
}
