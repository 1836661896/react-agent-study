import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
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
        <button
          type="button"
          disabled={createMutation.isPending}
          onClick={() => createMutation.mutate()}
        >
          {createMutation.isPending ? "创建中…" : "新建"}
        </button>
      </div>
      <div className="chat-page__sidebar-list">
        {isLoading && <div>加载中…</div>}
        {isError && (
          <div>
            加载失败：{error instanceof Error ? error.message : "未知错误"}
          </div>
        )}
        {!isLoading && !isError && items.length === 0 && <div>暂无会话</div>}
        {items.map((item) => (
          <div key={item.id} className="chat-page__conv-row">
            <button
              type="button"
              className={
                item.id === selectedId
                  ? "chat-page__conv-item chat-page__conv-item--active"
                  : "chat-page__conv-item"
              }
              onClick={() => onSelectConversation(item)}
            >
              {item.memory_title || `会话 #${item.id}`}
            </button>
            <button
              type="button"
              disabled={deleteMutation.isPending}
              onClick={() => {
                if (!window.confirm(`删除会话 #${item.id}？`)) return
                deleteMutation.mutate(item.id)
              }}
            >
              删除
            </button>
          </div>
        ))}
      </div>
    </>
  )
}
