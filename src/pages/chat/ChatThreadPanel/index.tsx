/**
 * 右侧会话线程：消息历史（无限滚动向前翻页）、SSE 流式展示、发送区。
 * 业务逻辑见 useChatThreadPanel；样式见 index.scss。
 */
import "./index.scss"
import { DownloadOutlined } from "@ant-design/icons"
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
import { downloadArtifact } from "@/api/artifacts"
import { errorDescription } from "@/utils/common"
import { formatDisplayDateTime } from "@/utils/datetime"
import { CHAT_ROUTING_OPTIONS, type ChatThreadPanelProps } from "./type"
import { conversationPanelTitle, useChatThreadPanel } from "./useChatThreadPanel"

export default function ChatThreadPanel({
  conversation,
  preset = null,
}: ChatThreadPanelProps) {
  const {
    scrollRef,  // 滚动区域引用
    messageQuery,
    ordered,  // 排序后的消息列表
    draft,  // 草稿
    setDraft,  // 设置草稿
    streaming,  // 流式状态
    streamingText,  // 流式文本
    optimisticUser,  // 乐观用户气泡
    routing,  // 路由
    setRouting,  // 设置路由
    toolTrace,  // 工具调用轨迹
    loadOlder,  // 加载更多历史记录
    onScrollAreaScroll,  // 滚动区域滚动事件
    handleSend,  // 发送消息
    hasThreadContent,  // 是否有线程内容
    showEmptyHint,  // 显示空提示
  } = useChatThreadPanel({ conversation, preset })

  if (conversation === null) {
    // 如果会话为空，显示空提示
    return (
      <Card
        className="chat-thread-panel chat-thread-panel--placeholder"
        title="会话内容"
      >
        <Empty description="请在左侧选择一个会话或创建新会话" />
      </Card>
    )
  }

  // 如果会话不为空，显示会话内容
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
                          <Space orientation="vertical" size="small">
                            <Typography.Paragraph className="chat-thread-panel__msg-content">
                              {toolTrace.resultText}
                            </Typography.Paragraph>
                            {toolTrace.artifactId ? (
                              <Button
                                type="link"
                                size="small"
                                icon={<DownloadOutlined />}
                                onClick={() => {
                                  void downloadArtifact(
                                    toolTrace.artifactId!,
                                  ).catch((e) =>
                                    message.error(errorDescription(e)),
                                  )
                                }}
                              >
                                下载文件
                              </Button>
                            ) : null}
                          </Space>
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
              options={CHAT_ROUTING_OPTIONS}
              value={routing}
              onChange={(v) => setRouting(v as typeof routing)}
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
