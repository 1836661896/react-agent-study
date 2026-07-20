import { useQuery } from "@tanstack/react-query"
import { getHealth } from "@/api/health"

export default function HealthBage() {
  const { data, isError, isLoading } = useQuery({
    queryKey: ["health"],
    queryFn: getHealth,
    refetchInterval: 30_000,
    retry: 1,
  })

  const online = !isError && data?.code === 0

  let label = "检查中…"

  if (!isLoading) {
    label = online ? "后端在线" : "后端离线"
  }
  return (
    <span
      style={{
        marginLeft: "auto",
        fontSize: 12,
        color: online ? "@389e0d" : isLoading ? "#8c8c8c" : "#cf1322",
      }}
    >
      {label}
    </span>
  )
}
