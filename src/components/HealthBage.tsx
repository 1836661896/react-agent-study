import { useQuery } from "@tanstack/react-query"
import { Tag, Tooltip } from "antd"
import { getHealth } from "@/api/health"
import { HttpError } from "@/utils/request"

export default function HealthBage() {
  const q = useQuery({
    queryKey: ["health"],
    queryFn: getHealth,
    refetchInterval: 30_000,
    retry: 1,
  })

  if (q.isPending) {
    return <Tag color="default">后端监测中……</Tag>
  }

  if (q.isError) {
    const msg =
      q.error instanceof HttpError
        ? q.error.userMessage
        : q.error instanceof Error
          ? q.error.message
          : "未知错误"
    return (
      <Tooltip title={msg}>
        <Tag color="error">后端异常</Tag>
      </Tooltip>
    )
  }

  const label = q.data?.msg.trim() || "正常"
  return (
    <Tooltip title={`code=${q.data.code ?? 0}`}>
      <Tag color="success">{label}</Tag>
    </Tooltip>
  )
}
