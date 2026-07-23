import { useQuery, useQueryClient } from "@tanstack/react-query"
import {
  Alert,
  Button,
  Collapse,
  Empty,
  Image,
  Input,
  message,
  Radio,
  Spin,
  Tag,
  Upload,
} from "antd"
import { useEffect, useState } from "react"
import { downloadArtifact, uploadArtifact } from "@/api/artifacts"
import { postChatStream } from "@/api/chatStream"
import { getConversationMessages } from "@/api/conversations"
import { getDict } from "@/api/dict"
import type { PostChatStreamBody } from "@/types/chatStream"
import type { MessageAttachmentItem } from "@/types/conversations"
import { HttpError } from "@/utils/request"
import { buildApiUrl } from "@/utils/url"
import type { ChatThreadPanelProps } from "./type"

// 工具调用/结果项
type ToolItem =
  | {
      id: string
      kind: "call"
      tool: string
      arguments: Record<string, unknown>
    }
  | {
      id: string
      kind: "result"
      tool: string
      text: string
      is_error?: boolean
    }

// 待上传附件
type PendingAttachment = {
  artifact_id: string
  filename: string
  mime_type: string
  size_bytes: number
  previewUrl?: string
}

type IdentityMode = "normal" | string

const MAX_ARTIFACT_BYTES = 1024 * 1024 * 10

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

  const { data: presetRes } = useQuery({
    queryKey: ["dict", "presets"],
    queryFn: () => getDict("presets"),
  })

  const identityOptions = [
    { label: "普通", value: "normal" },
    ...(presetRes?.data.records ?? []).map((r) => ({
      label: r.label,
      value: r.value,
    })),
  ]

  const [draft, setDraft] = useState("") // 草稿
  const [streaming, setStreaming] = useState(false) // 是否正在生成
  const [streamingText, setStreamingText] = useState("") // 正在生成的文本
  const [optimisticUser, setOptimisticUser] = useState<string | null>(null) // 用户发送的消息

  const [toolItems, setToolItems] = useState<ToolItem[]>([]) // 工具调用/结果项
  const [toolsOpen, setToolsOpen] = useState(false) // 工具抽屉是否打开

  const [pending, setPending] = useState<PendingAttachment[]>([]) // 待上传附件
  const [uploading, setUploading] = useState(false) // 是否正在上传

  const [identity, setIdentity] = useState<IdentityMode>("normal") // 身份

  /** 切换会话：清空待发 / 工具区，释放预览 URL */
  useEffect(() => {
    setPending((prev) => {
      for (const p of prev) {
        if (p.previewUrl) URL.revokeObjectURL(p.previewUrl)
      }
      return []
    })
    setToolItems([])
    setToolsOpen(false)
    setOptimisticUser(null)
    setStreaming(false)
    setStreamingText("")
    setDraft("")
  }, [])

  const attachmentSrc = (url: string) =>
    url.startsWith("http") ? url : buildApiUrl(url)

  /** 上传附件 */
  const handlePickFile = async (file: File) => {
    if (!hasConversation || streaming || uploading) return // 如果会话不存在、正在生成、正在上传，则不进行上传
    if (file.size > MAX_ARTIFACT_BYTES) {
      message.warning("文件过大")
      return
    }
    setUploading(true)
    try {
      const res = uploadArtifact(file)
      const d = (await res).data
      const isImage = file.type.startsWith("image/")
      const previewUrl = isImage ? URL.createObjectURL(file) : undefined
      setPending((prev) => [
        ...prev,
        {
          artifact_id: d.artifact_id,
          filename: d.filename,
          mime_type: d.mime_type ?? file.type,
          size_bytes: d.size_bytes ?? file.size,
          ...(previewUrl !== undefined ? { previewUrl } : {}),
        },
      ])
    } catch (e) {
      const msg = e instanceof HttpError ? e.userMessage : "上传失败"
      message.error(msg)
    } finally {
      setUploading(false)
    }
  }

  const removePending = (artifact_id: string) => {
    setPending((prev) => {
      const target = prev.find((x) => x.artifact_id === artifact_id)
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl)
      return prev.filter((i) => i.artifact_id !== artifact_id)
    })
  }

  /** 点历史附件 → 下载 */
  const handleDownloadAttachment = (item: MessageAttachmentItem) => {
    void downloadArtifact(item.artifact_id).catch((e) => {
      const msg = e instanceof HttpError ? e.userMessage : "下载失败"
      message.error(msg)
    })
  }

  /** 发送消息 */
  const handleSend = async () => {
    if (conversationId === null || streaming) return
    const text = draft.trim() // 消息内容
    const attachmentIds = pending.map((p) => p.artifact_id)
    if (!text && attachmentIds.length === 0) return // 如果消息内容为空，则不发送

    for (const item of pending) {
      if (item.previewUrl) URL.revokeObjectURL(item.previewUrl)
    }

    setDraft("") // 清空草稿
    setStreaming(true) // 设置正在生成
    setStreamingText("") // 清空正在生成的文本
    setToolItems([]) // 清空工具调用/结果项
    setPending([]) // 清空待上传附件
    setOptimisticUser(text || `（附件 ${attachmentIds.length} 个）`) // 设置用户发送的消息

    try {
      const body: PostChatStreamBody = {
        conversation_id: conversationId,
        routing: "auto",
      }
      if (text) body.message = text
      if (attachmentIds.length > 0) body.attachment_ids = attachmentIds
      if (identity !== "normal") body.preset = identity
      // 发送消息
      await postChatStream(body, {
        onDelta: (chunk) => {
          setStreamingText((prev) => prev + chunk)
        },
        onError: (msg) => {
          setStreamingText((prev) => prev || msg)
        },
        onToolCall: (payload) => {
          setToolItems((prev) => [
            ...prev,
            {
              id: crypto.randomUUID(),
              kind: "call",
              tool: payload.tool,
              arguments: payload.arguments,
            },
          ])
          setToolsOpen(true)
        },
        onToolResult: (payload) => {
          setToolItems((prev) => [
            ...prev,
            {
              id: crypto.randomUUID(),
              kind: "result",
              tool: payload.tool,
              text: payload.text,
              ...(payload.is_error !== undefined
                ? { is_error: payload.is_error }
                : {}),
            },
          ])
          setToolsOpen(true)
        },
        onDone: () => {
          void queryClient.invalidateQueries({
            queryKey: ["conversations", conversationId, "messages"],
          })
          void queryClient.invalidateQueries({
            queryKey: ["conversations", "list"],
          })
        },
      })
    } finally {
      setStreaming(false)
      setStreamingText("")
      setOptimisticUser(null)
      setToolsOpen(false)
    }
  }

  const messages = [...(data?.data?.records ?? [])].sort((a, b) => a.id - b.id) // 消息列表

  return (
    <>
      <div className="chat-page__messages">
        {!hasConversation && (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="请先选择或新建会话"
          />
        )}
        {hasConversation && isLoading && (
          <div style={{ padding: 24, textAlign: "center" }}>
            <Spin description="消息加载中…" />
          </div>
        )}
        {hasConversation && isError && (
          <Alert
            type="error"
            showIcon
            title="加载失败"
            description={error instanceof Error ? error.message : "未知错误"}
          />
        )}
        {hasConversation && !isLoading && !isError && messages.length === 0 && (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="暂无消息，可在下方发送"
          />
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={`chat-page__msg chat-page__msg--${m.role}`}
          >
            <div className="chat-page__msg-role">{m.role}</div>
            <div className="chat-page__msg-content">{m.content}</div>
            {m.attachments.length > 0 && (
              <div className="chat-page__msg-attachments">
                {m.attachments.map((a) =>
                  a.mime_type.startsWith("image/") ? (
                    <Button
                      key={a.artifact_id}
                      type="text"
                      className="chat-page__msg-thumb"
                      onClick={() => handleDownloadAttachment(a)}
                    >
                      <Image
                        src={attachmentSrc(a.url)}
                        alt={a.filename}
                        width={96}
                        height={96}
                        style={{ objectFit: "cover" }}
                        preview={false}
                      />
                    </Button>
                  ) : (
                    <Tag
                      key={a.artifact_id}
                      style={{ cursor: "pointer" }}
                      onClick={() => handleDownloadAttachment(a)}
                    >
                      {a.filename}
                    </Tag>
                  ),
                )}
              </div>
            )}
          </div>
        ))}
        {optimisticUser && (
          <div className="chat-page__msg chat-page__msg--user">
            <div className="chat-page__msg-role">user</div>
            <div className="chat-page__msg-content">{optimisticUser}</div>
          </div>
        )}
        {toolItems.length > 0 && (
          <Collapse
            className="chat-page__tool-drawer"
            size="small"
            activeKey={toolsOpen ? ["tools"] : []}
            onChange={(keys) => {
              const list = Array.isArray(keys) ? keys : [keys]
              setToolsOpen(list.map(String).includes("tools"))
            }}
            items={[
              {
                key: "tools",
                label: (
                  <span>
                    工具调用
                    <span className="chat-page__tool-drawer-count"> </span>
                  </span>
                ),
                children: toolItems.map((item) =>
                  item.kind === "call" ? (
                    <div
                      key={item.id}
                      className="chat-page__tool chat-page__tool--call"
                    >
                      <div className="chat-page__tool-label">tool_call</div>
                      <div className="chat-page__tool-name">{item.tool}</div>
                      <pre className="chat-page__tool-body">
                        {JSON.stringify(item.arguments, null, 2)}
                      </pre>
                    </div>
                  ) : (
                    <div
                      key={item.id}
                      className={`chat-page__tool chat-page__tool--result${item.is_error ? " is-error" : ""}`}
                    >
                      <div className="chat-page__tool-label">tool_result</div>
                      <div className="chat-page__tool-name">{item.tool}</div>
                      <pre className="chat-page__tool-body">{item.text}</pre>
                    </div>
                  ),
                ),
              },
            ]}
          />
        )}
        {streaming && streamingText && (
          <div className="chat-page__msg chat-page__msg--assistant">
            <div className="chat-page__msg-role">assistant（生成中）</div>
            <div className="chat-page__msg-content">{streamingText}</div>
          </div>
        )}
      </div>
      <div className="chat-page__composer">
        <div className="chat-page__composer-preset">
          <Radio.Group
            optionType="button"
            buttonStyle="solid"
            size="small"
            value={identity}
            disabled={streaming}
            onChange={(e) => setIdentity(e.target.value as IdentityMode)}
            options={identityOptions}
          />
        </div>

        <div className="chat-page__composer-attachments">
          {pending.map((p) =>
            p.mime_type.startsWith("image/") && p.previewUrl ? (
              <div key={p.artifact_id} className="chat-page__composer-thumb">
                <Image
                  src={p.previewUrl}
                  alt={p.filename}
                  width={72}
                  height={72}
                  style={{ objectFit: "cover" }}
                />
                <Button
                  type="text"
                  size="small"
                  className="chat-page__composer-thumb-remove"
                  disabled={streaming || uploading}
                  onClick={() => removePending(p.artifact_id)}
                >
                  ×
                </Button>
              </div>
            ) : (
              <Tag
                key={p.artifact_id}
                closable={!streaming && !uploading}
                onClose={() => removePending(p.artifact_id)}
              >
                {p.filename}
              </Tag>
            ),
          )}
        </div>

        <div className="chat-page__composer-main">
          <Input.TextArea
            className="chat-page__composer-input"
            rows={3}
            placeholder={
              hasConversation ? "输入消息…（可粘贴文件）" : "请先选择会话"
            }
            onPaste={(e) => {
              const list = e.clipboardData?.files
              if (!list?.length) return
              // 阻止默认粘贴行为
              e.preventDefault()
              const files = Array.from(list)
              void (async () => {
                for (const file of files) {
                  await handlePickFile(file)
                }
              })()
            }}
            disabled={!hasConversation || streaming}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              // 阻止中文输入法输入
              if (e.nativeEvent.isComposing) return
              // 阻止其他键入
              if (e.key !== "Enter" || e.shiftKey) return
              // 阻止默认行为
              e.preventDefault()
              // 如果会话不存在、正在生成、正在上传，则不发送
              if (!hasConversation || streaming || uploading) return
              // 如果消息内容为空，且没有待上传附件，则不发送
              if (!draft.trim() && pending.length === 0) return
              // 发送消息
              void handleSend()
            }}
          />
          <div className="chat-page__composer-actions">
            <Upload
              beforeUpload={(file) => {
                handlePickFile(file as File)
                return false
              }}
              showUploadList={false}
            >
              <Button disabled={!hasConversation || streaming || uploading}>
                {uploading ? "上传中…" : "上传附件"}
              </Button>
            </Upload>
            <Button
              type="primary"
              disabled={
                !hasConversation ||
                streaming ||
                uploading ||
                (!draft.trim() && pending.length === 0)
              }
              onClick={() => void handleSend()}
            >
              {streaming ? "生成中…" : "发送"}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
