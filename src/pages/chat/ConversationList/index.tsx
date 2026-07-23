import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Alert, Button, Empty, Modal } from "antd"
import {
  createConversation,
  deleteConversationItems,
  getConversationList,
} from "@/api/conversations"
import type { ConversationListProps } from "./type"

/** 左侧会话列表：查询 / 新建；选中态由父组件控制 */
export default function ConversationList({
  selectedId,
  onSelectConversation,
}: ConversationListProps) {
  const page = 1 // 页码
  const limit = 20 // 每页条数
  const queryClient = useQueryClient() // 查询客户端

  /** 查询会话列表 */
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["conversations", "list", page, limit],
    queryFn: () => getConversationList({ page, limit }),
  })

  /** 会话列表 */
  const items = data?.data?.records ?? []

  /** 创建会话 */
  const createMutation = useMutation({
    mutationFn: () => createConversation({ kind: "chat" }),
    onSuccess: (res) => {
      void queryClient.invalidateQueries({
        queryKey: ["conversations", "list"],
      })
      const id = res.data.id
      onSelectConversation({
        id,
        kind: "chat",
        memory_title: "",
        created_at: "",
        updated_at: "",
      })
    },
  })

  /** 删除会话 */
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteConversationItems({ ids: [id] }),
    onSuccess: (_, id) => {
      void queryClient.invalidateQueries({
        queryKey: ["conversations", "list"],
      })
      if (id === selectedId) onSelectConversation(null)
    },
  })

  return (
    <>
      <div className="chat-page__sidebar-header">
        <span>会话</span>
        <Button
          type="primary"
          size="small"
          disabled={createMutation.isPending}
          onClick={() => createMutation.mutate()}
        >
          {createMutation.isPending ? "创建中…" : "新建"}
        </Button>
      </div>
      <div className="chat-page__sidebar-list">
        {isLoading && <div>加载中…</div>}
        {isError && (
          <Alert
            type="error"
            showIcon
            title="加载失败"
            description={error instanceof Error ? error.message : "未知错误"}
          />
        )}
        {!isLoading && !isError && items.length === 0 && (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无会话" />
        )}
        {items.map((item) => (
          <div key={item.id} className="chat-page__conv-row">
            <Button
              type="text"
              block
              className={
                item.id === selectedId
                  ? "chat-page__conv-item chat-page__conv-item--active"
                  : "chat-page__conv-item"
              }
              onClick={() => onSelectConversation(item)}
            >
              {item.memory_title || `会话 #${item.id}`}
            </Button>
            <Button
              type="link"
              danger
              size="small"
              disabled={deleteMutation.isPending}
              onClick={() => {
                Modal.confirm({
                  title: "删除会话",
                  content: `确定删除会话 ${item.memory_title ?? item.id}？`,
                  okText: "删除",
                  okType: "danger",
                  cancelText: "取消",
                  onOk: () => deleteMutation.mutate(item.id),
                })
              }}
            >
              删除
            </Button>
          </div>
        ))}
      </div>
    </>
  )
}
