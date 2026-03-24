import { getLastStep } from "@/api/agent";
import { toUserErrorMessage } from "@/lib/http";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert, Button, Card, Descriptions, Empty, Space, Spin } from "antd";

function LastStep() {
  const queryClient = useQueryClient()
  // 获取最后一步操作
  const lastStepQuery = useQuery({
    queryKey: ["lastStep"],
    queryFn: getLastStep,
    staleTime: 10_000,
    refetchOnWindowFocus: false
  })

  const lastStep = lastStepQuery.data?.data

  return (
    <Card title="操作记录">
      <Space style={{ marginBottom: 16 }}>
        <Button
          onClick={() => queryClient.invalidateQueries({ queryKey: ["lastStep"] })}
        >
          刷新最后一步操作记录
        </Button>
        {lastStepQuery.isError && (
          <Button onClick={() => lastStepQuery.refetch()}>
            重试
          </Button>
        )}
      </Space>
      {lastStepQuery.isLoading && <Spin />}

      {lastStepQuery.isError && (
        <Alert
          type="error"
          showIcon
          title="操作记录获取失败"
          description={toUserErrorMessage(lastStepQuery.error)}
        />
      )}

      {!lastStepQuery.isLoading && !lastStepQuery.isError && !lastStep && (
        <Empty description="暂无操作记录" />
      )}

      {!lastStepQuery.isError && !lastStepQuery.isLoading && lastStep && (
        <Descriptions title="最后一步操作" bordered column={1} size='small'>
          <Descriptions.Item label="操作内容">{lastStep.tool_name}</Descriptions.Item>
          <Descriptions.Item label="输入命令">{lastStep.input_text}</Descriptions.Item>
          <Descriptions.Item label="调用是否成功">{lastStep.ok_flag ? "成功" : "失败"}</Descriptions.Item>
          <Descriptions.Item label="提示消息">{lastStep.msg}</Descriptions.Item>
          <Descriptions.Item label="调用时间">{lastStep.timestamp}</Descriptions.Item>
        </Descriptions>
      )}
    </Card>
  )
}

export default LastStep