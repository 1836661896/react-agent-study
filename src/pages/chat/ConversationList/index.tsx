/**
 * 左侧会话列表：分页查询、单选、批量勾选删除、新建会话。
 * 样式见同目录 index.scss，避免 TSX 内大块 style 对象。
 */
import "./index.scss"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  Alert,
  Button,
  Card,
  Checkbox,
  Empty,
  List,
  message,
  Pagination,
  Popconfirm,
  Space,
  Spin,
  Tag,
  Typography,
} from "antd"
import { useEffect, useMemo, useState } from "react"
import {
  createConversation,
  deleteConversationItems,
  getConversationList,
} from "@/api/conversations"
import type {
  ConversationCreateBody,
  ConversationListItem,
} from "@/types/conversations"
import { errorDescription } from "@/utils/common"
import { formatDisplayDateTime } from "@/utils/datetime"

type ConversationListProps = {
  selectedId: number | null
  onSelectConversation: (item: ConversationListItem | null) => void
  onScheduleSessionCreated?: (ud: number) => void
}

export default function ConversationList({
  selectedId,
  onSelectConversation,
  onScheduleSessionCreated,
}: ConversationListProps) {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  /** 批量删除：跨页勾选在本组件内用 id 数组维护 */
  const [batchIds, setBatchIds] = useState<number[]>([])

  const queryClient = useQueryClient()

  const listQuery = useQuery({
    queryKey: ["conversations", "list", page, limit] as const,
    queryFn: () => getConversationList({ page, limit }),
    staleTime: 10_000,
    refetchOnWindowFocus: false,
  })

  const deleteMutation = useMutation({
    mutationFn: (ids: number[]) => deleteConversationItems({ ids }),
    onSuccess: (res, deletedIds) => {
      message.success(res.msg)
      queryClient.invalidateQueries({ queryKey: ["conversations", "list"] })
      queryClient.invalidateQueries({ queryKey: ["conversations", "messages"] })
      setBatchIds([])
      if (selectedId != null && deletedIds.includes(selectedId)) {
        onSelectConversation(null)
      }
    },
    onError: (err) => {
      message.error(errorDescription(err))
    },
  })

  const createMutation = useMutation({
    mutationFn: (body?: ConversationCreateBody) => createConversation(body),
    onSuccess: (res, variables) => {
      message.success(res.msg)
      const id = res.data.id
      if (id === null) {
        message.warning("创建成功但未返回会话 id")
        return
      }
      queryClient.invalidateQueries({ queryKey: ["conversations", "list"] })
      queryClient.invalidateQueries({ queryKey: ["conversations", "messages"] })
      setPage(1)
      setBatchIds([])
      // 新建后立即选中：右侧线程区可发首条消息
      onSelectConversation({
        id,
        kind: variables?.kind ?? "chat",
        memory_title: "",
        memory_updated_at: null,
      })
    },
    onError: (err) => {
      message.error(errorDescription(err))
    },
  })

  const envelope = listQuery.data
  const listResult = envelope?.data
  const records = listResult?.records ?? []
  const total = listResult?.total ?? 0

  /** 仅首屏无缓存时展示全页 Spin，避免与空列表闪烁冲突 */
  const showInitialSpinner = useMemo(
    () => listQuery.isPending && !listQuery.isFetched,
    [listQuery.isPending, listQuery.isFetched],
  )

  /** 删除等导致 total 变小后，当前 page 可能超出最大页，接口会返回空 records；夹紧页码避免「空列表假象」 */
  useEffect(() => {
    if (listQuery.isPending || listQuery.isError) return
    const data = listQuery.data?.data
    if (data == null) return

    const totalCount = data.total
    if (totalCount <= 0) {
      if (page !== 1) setPage(1)
      return
    }

    const maxPage = Math.max(1, Math.ceil(totalCount / limit))
    if (page > maxPage) {
      setPage(maxPage)
    }
  }, [listQuery.isPending, listQuery.isError, listQuery.data, page, limit])

  const allPageSelected =
    records.length > 0 && records.every((r) => batchIds.includes(r.id))

  function toggleBatchId(id: number) {
    setBatchIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  function toggleSelectAllOnPage() {
    const pageIds = records.map((r) => r.id)
    if (allPageSelected) {
      setBatchIds((prev) => prev.filter((id) => !pageIds.includes(id)))
    } else {
      setBatchIds((prev) => Array.from(new Set([...prev, ...pageIds])))
    }
  }

  /** 批量删除按钮 loading：仅当正在删除且变量与当前勾选集合一致时亮 */
  function batchDeletingMatches(ids: number[]) {
    const v = deleteMutation.variables
    if (!deleteMutation.isPending || !v) return false
    if (v.length !== ids.length) return false
    const a = [...v].sort((x, y) => x - y)
    const b = [...ids].sort((x, y) => x - y)
    return a.every((n, i) => n === b[i])
  }

  return (
    <Card
      className="conversation-list"
      title="会话列表"
      extra={
        selectedId != null ? (
          <Typography.Text type="secondary">
            已选会话 ID：{selectedId}
          </Typography.Text>
        ) : (
          <Typography.Text type="secondary">未选择会话</Typography.Text>
        )
      }
    >
      <Space
        orientation="vertical"
        size="middle"
        className="conversation-list__stack"
      >
        {/* 工具条：刷新 / 新建；失败时出现重试 */}
        <Space>
          <Button
            onClick={() => listQuery.refetch()}
            disabled={listQuery.isFetching}
          >
            刷新
          </Button>
          <Button
            type="primary"
            onClick={() => createMutation.mutate(undefined)}
            loading={createMutation.isPending}
          >
            新建会话
          </Button>
          <Button
            onClick={() =>
              createMutation.mutate(
                { kind: "chat" },
                {
                  onSuccess: (res) => {
                    const id = res.data.id
                    if (id != null) onScheduleSessionCreated?.(id)
                  },
                },
              )
            }
            loading={createMutation.isPending}
          >
            行程助手
          </Button>
          {listQuery.isError ? (
            <Button onClick={() => listQuery.refetch()}>重试</Button>
          ) : null}
        </Space>

        {/* 有数据时才展示批量操作，避免空页出现无意义勾选 */}
        {!listQuery.isError && records.length > 0 ? (
          <>
            <Checkbox
              checked={allPageSelected}
              indeterminate={
                !allPageSelected && records.some((r) => batchIds.includes(r.id))
              }
              onChange={() => toggleSelectAllOnPage()}
            >
              全选本页
            </Checkbox>
            <Button
              disabled={batchIds.length === 0}
              onClick={() => setBatchIds([])}
            >
              清空勾选
            </Button>
            <Popconfirm
              title={`确认删除选中的 ${batchIds.length} 条会话？`}
              okText="删除"
              cancelText="取消"
              okButtonProps={{ danger: true }}
              disabled={batchIds.length === 0}
              onConfirm={() => deleteMutation.mutate([...batchIds])}
            >
              <Button
                danger
                disabled={batchIds.length === 0}
                loading={batchDeletingMatches(batchIds)}
              >
                批量删除{batchIds.length > 0 ? `（${batchIds.length}）` : ""}
              </Button>
            </Popconfirm>
          </>
        ) : null}

        {listQuery.isError ? (
          <Alert
            type="error"
            showIcon
            title="会话列表加载失败"
            description={errorDescription(listQuery.error)}
          />
        ) : null}

        <Spin spinning={showInitialSpinner || listQuery.isRefetching}>
          {!listQuery.isError && !showInitialSpinner && records.length === 0 ? (
            <Empty description="暂无会话">
              <Button
                type="primary"
                onClick={() => createMutation.mutate(undefined)}
                loading={createMutation.isPending}
              >
                新建会话
              </Button>
            </Empty>
          ) : null}

          {!listQuery.isError && records.length > 0 ? (
            <List
              bordered
              dataSource={records}
              renderItem={(item) => {
                const active = selectedId === item.id
                const checked = batchIds.includes(item.id)
                const deletingOne =
                  deleteMutation.isPending &&
                  deleteMutation.variables?.length === 1 &&
                  deleteMutation.variables[0] === item.id
                return (
                  <List.Item
                    onClick={() => onSelectConversation(item)}
                    className={
                      active
                        ? "conversation-list__item conversation-list__item--active"
                        : "conversation-list__item"
                    }
                    actions={[
                      <Popconfirm
                        key="delete"
                        title="确定删除该会话？"
                        okText="删除"
                        cancelText="取消"
                        okButtonProps={{ danger: true }}
                        onConfirm={() => deleteMutation.mutate([item.id])}
                      >
                        <Button
                          danger
                          size="small"
                          loading={deletingOne}
                          onClick={(e) => e.stopPropagation()}
                        >
                          删除
                        </Button>
                      </Popconfirm>,
                    ]}
                  >
                    <Space
                      align="start"
                      className="conversation-list__checkbox-cell"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Checkbox
                        checked={checked}
                        onChange={() => toggleBatchId(item.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </Space>
                    <List.Item.Meta
                      title={
                        <Space size="small" wrap>
                          <span>{item.memory_title || "（无标题）"}</span>
                          <Tag>{item.kind}</Tag>
                        </Space>
                      }
                      description={
                        <Typography.Text
                          type="secondary"
                          className="conversation-list__meta-small"
                        >
                          id: {item.id} · 创建{" "}
                          {formatDisplayDateTime(item.created_at)}
                          {item.memory_updated_at
                            ? ` · 更新 ${formatDisplayDateTime(item.memory_updated_at)}`
                            : ""}
                        </Typography.Text>
                      }
                    />
                  </List.Item>
                )
              }}
            />
          ) : null}
        </Spin>

        {!listQuery.isError && total > 0 ? (
          <Pagination
            align="end"
            current={page}
            pageSize={limit}
            total={total}
            showSizeChanger
            pageSizeOptions={[10, 20, 50]}
            onChange={(p, ps) => {
              setBatchIds([])
              setPage(p)
              setLimit(ps)
            }}
          />
        ) : null}
      </Space>
    </Card>
  )
}
