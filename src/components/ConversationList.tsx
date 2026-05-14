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
import { useMemo, useState } from "react"
import {
  deleteConversationItems,
  getConversationList,
} from "@/api/conversations"
import { HttpError } from "@/utils/request"

function errorDescription(err: unknown): string {
  if (err instanceof HttpError) return err.userMessage
  if (err instanceof Error) return err.message || "请求失败"
  return "请求失败"
}

export default function ConversationList() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [selectedId, setSelectedId] = useState<number | null>(null)
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
      setBatchIds([])
      if (selectedId != null && deletedIds.includes(selectedId)) {
        setSelectedId(null)
      }
    },
    onError: (err) => {
      message.error(errorDescription(err))
    },
  })

  const envelope = listQuery.data
  const listResult = envelope?.data
  const records = listResult?.records ?? []
  const total = listResult?.total ?? 0

  const showInitialSpinner = useMemo(
    () => listQuery.isPending && !listQuery.isFetched,
    [listQuery.isPending, listQuery.isFetched],
  )

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
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <Space>
          <Button
            onClick={() => listQuery.refetch()}
            disabled={listQuery.isFetching}
          >
            刷新
          </Button>
          {listQuery.isError ? (
            <Button onClick={() => listQuery.refetch()}>重试</Button>
          ) : null}
        </Space>

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
            <Empty description="暂无会话" />
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
                    onClick={() => setSelectedId(item.id)}
                    style={{
                      cursor: "pointer",
                      background: active
                        ? "var(--accent-bg, rgba(170, 59, 255, 0.08))"
                        : undefined,
                    }}
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
                      onClick={(e) => e.stopPropagation()}
                      style={{ marginRight: 8 }}
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
                          style={{ fontSize: 12 }}
                        >
                          id: {item.id} · 创建 {item.created_at}
                          {item.memory_updated_at
                            ? ` · 更新 ${item.memory_updated_at}`
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
