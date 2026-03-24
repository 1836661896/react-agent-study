import { getStepList } from "@/api/agent";
import { toUserErrorMessage } from "@/lib/http";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert, Button, Card, Descriptions, Empty, Space, Spin } from "antd";

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
        stepList.map((item, index) => (
          <Descriptions key={`${index}-${item.timestamp}`} title={`记录${index + 1}`} bordered column={1} size='small'>
            <Descriptions.Item label="操作内容">{item.tool_name}</Descriptions.Item>
            <Descriptions.Item label="输入命令">{item.input_text}</Descriptions.Item>
            <Descriptions.Item label="调用是否成功">{item.ok_flag ? "成功" : "失败"}</Descriptions.Item>
            <Descriptions.Item label="提示消息">{item.msg}</Descriptions.Item>
            <Descriptions.Item label="调用时间">{item.timestamp}</Descriptions.Item>
          </Descriptions>
        ))
      )}
    </Card>
  )
}