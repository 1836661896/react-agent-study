import { useQuery } from "@tanstack/react-query"
import { Alert, Card, Empty, Space, Spin, Tag, Typography } from "antd"
import { getConversationMessages } from "@/api/conversations"
import type { ConversationListItem } from "@/types/conversations"
import { errorDescription } from "@/utils/common"

// 会话面板属性
type ChatThreadPanelProp = {
  conversation: ConversationListItem | null
}

// 会话面板标题
function conversationPanelTitle(item: ConversationListItem): string {
  const t = item.memory_title?.trim()
  return t ? t : `会话 ${item.id}`
}

// 会话面板
export default function ChatThreadPanel({ conversation }: ChatThreadPanelProp) {
  // 会话消息查询
  const messageQuery = useQuery({
    queryKey: [
      "conversations",
      "messages",
      conversation?.id ?? null,
      1,
      100,
    ] as const,
    queryFn: () =>
      getConversationMessages({
        conversation_id: conversation?.id ?? 0,
        page: 1,
        limit: 100,
      }),
    enabled: conversation !== null,
    staleTime: 5_000,
  })

  // 会话消息
  const raw = messageQuery.data?.data.records ?? []
  // 会话消息排序
  const ordered = [...raw].sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  )

  if (conversation === null) {
    return (
      <Card title="会话内容">
        <Empty description="请在左侧选择一个会话或创建新会话" />
      </Card>
    )
  }

  return (
    <Card
      title={conversationPanelTitle(conversation)}
      extra={
        <Space size="small" wrap>
          <Tag>{conversation.kind}</Tag>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            id: {conversation.id}
          </Typography.Text>
        </Space>
      }
    >
      <Space orientation="vertical" size="middle" style={{ width: "100%" }}>
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

        <Spin spinning={messageQuery.isPending}>
          {!messageQuery.isError && ordered.length === 0 ? (
            <Empty description="该会话暂无消息" />
          ) : null}

          {!messageQuery.isError && ordered.length > 0 ? (
            <div
              style={{
                maxHeight: "60vh",
                overflow: "auto",
                padding: 8,
                background: "var(--ant-color-fill-quaternary, #f5f5f5)",
                borderRadius: 8,
              }}
            >
              <Space
                orientation="vertical"
                size="small"
                style={{ width: "100%" }}
              >
                {ordered.map((m) => (
                  <div
                    key={m.id}
                    style={{
                      display: "flex",
                      justifyContent:
                        m.role === "user" ? "flex-end" : "flex-start",
                    }}
                  >
                    <Card
                      size="small"
                      style={{
                        maxWidth: "85%",
                        background:
                          m.role === "user"
                            ? "var(--ant-color-primary-bg, #e6f4ff)"
                            : undefined,
                      }}
                    >
                      <Space
                        orientation="vertical"
                        size={0}
                        style={{ width: "100%" }}
                      >
                        <Space size="small">
                          <Tag>{m.role}</Tag>
                          <Typography.Text
                            type="secondary"
                            style={{ fontSize: 11 }}
                          >
                            {m.created_at}
                          </Typography.Text>
                        </Space>
                        <Typography.Paragraph
                          style={{ marginBottom: 0, whiteSpace: "pre-wrap" }}
                        >
                          {m.content}
                        </Typography.Paragraph>
                      </Space>
                    </Card>
                  </div>
                ))}
              </Space>
            </div>
          ) : null}
        </Spin>
      </Space>
    </Card>
  )
}
