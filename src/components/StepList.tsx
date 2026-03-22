import { getStepList } from "@/api/agent";
import { useQuery } from "@tanstack/react-query";
import { Card, Descriptions } from "antd";

export default function StepList() {
  const limit = 10
  // 获取操作列表
  const stepListQuery = useQuery({
    queryKey: ["stepList", limit] as const,
    queryFn: ({ queryKey }) => {
      const [, limit] = queryKey
      return getStepList(limit)
    }
  })

  const stepList = stepListQuery.data?.data
  return (
    <Card title="操作历史">
      {(stepList ?? []).map((item, index) => (
        <Descriptions key={`${index}-${item.timestamp}`} title={`记录${index + 1}`} bordered column={1} size='small'>
          <Descriptions.Item label="操作内容">{item?.tool_name}</Descriptions.Item>
          <Descriptions.Item label="输入命令">{item?.input_text}</Descriptions.Item>
          <Descriptions.Item label="调用是否成功">{item?.ok_flag ? "成功" : "失败"}</Descriptions.Item>
          <Descriptions.Item label="提示消息">{item?.msg}</Descriptions.Item>
          <Descriptions.Item label="调用时间">{item?.timestamp}</Descriptions.Item>
        </Descriptions>
      ))}
    </Card>
  )
}