import { getLastStep } from "@/api/agent";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert, Button, Card, Descriptions, Empty } from "antd";

function LastStep() {
  const queryClient = useQueryClient()
  // 获取最后一步操作
  const lastStepQuery = useQuery({
    queryKey: ["lastStep"],
    queryFn: getLastStep
  })

  const lastStep = lastStepQuery.data?.data
  return (
    <Card title="操作记录">
      <Button
        onClick={() => queryClient.invalidateQueries({ queryKey: ["lastStep"] })}
        style={{ marginBottom: 20 }}
      >
        刷新最后一步操作记录
      </Button>
      {lastStepQuery.isError && <Empty>操作记录获取失败</Empty>}
      {lastStepQuery.isLoading && <Alert type="error" showIcon title="加载中" />}
      {!lastStepQuery.isError &&
        !lastStepQuery.isLoading &&
        <Descriptions title="最后一步操作" bordered column={1} size='small'>
          <Descriptions.Item label="操作内容">{lastStep?.tool_name}</Descriptions.Item>
          <Descriptions.Item label="输入命令">{lastStep?.input_text}</Descriptions.Item>
          <Descriptions.Item label="调用是否成功">{lastStep?.ok_flag ? "成功" : "失败"}</Descriptions.Item>
          <Descriptions.Item label="提示消息">{lastStep?.msg}</Descriptions.Item>
          <Descriptions.Item label="调用时间">{lastStep?.timestamp}</Descriptions.Item>
        </Descriptions>
      }
    </Card>
  )
}

export default LastStep