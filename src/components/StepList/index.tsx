import { getStepList } from "@/api/agent";
import { toUserErrorMessage } from "@/lib/http";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert, Button, Card, Descriptions, Empty, Space, Spin, Timeline } from "antd";

export default function StepList() {
  const limit = 10
  const queryClient = useQueryClient()
  // 获取操作列表
  const stepListQuery = useQuery({
    queryKey: ["stepList", limit] as const,
    queryFn: ({ queryKey }) => {
      const [, limit] = queryKey
      return getStepList(limit)
    },
    staleTime: 10_000,
    refetchOnWindowFocus: false
  })

  const stepList = stepListQuery.data?.data ?? []

  const items = stepList.map((s, i) => ({
    key: `${i}-${s.timestamp}`,
    color: s.ok_flag ? "green" : "red",
    content: (
      <div>
        <div><strong>{s.tool_name}</strong> · {s.input_text}</div>
        <div style={{ opacity: 0.75 }}>{s.msg}</div>
        <div style={{ fontSize: 12, opacity: 0.6 }}>{s.timestamp}</div>
      </div>
    )
  }))

  return (
    <Card title="操作历史">
      <Space style={{ marginBottom: 16 }}>
        <Button onClick={() => queryClient.invalidateQueries({ queryKey: ["stepList"] })}>
          刷新
        </Button>
        {stepListQuery.isError && (
          <Button onClick={() => stepListQuery.refetch()}>
            重试
          </Button>
        )}
      </Space>

      {stepListQuery.isLoading && <Spin />}

      {stepListQuery.isError && (
        <Alert
          type="error"
          showIcon
          title="操作历史加载失败"
          description={toUserErrorMessage(stepListQuery.error)}
        />
      )}

      {!stepListQuery.isError && !stepListQuery.isLoading && stepList.length === 0 && (
        <Empty description="暂无操作记录" />
      )}
      {!stepListQuery.isError && !stepListQuery.isLoading && stepList.length > 0 && (
        <Timeline mode="start" items={items} />
      )}
    </Card>
  )
}