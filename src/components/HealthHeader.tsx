import { getHealth } from "@/api/common"
import { Space, Tag, Typography } from "antd"
import { useEffect, useState } from "react"

type HealthHeaderType = "ok" | "error" | null

function HealthHeader() {
  const [healthStatus, setHealthStatus] = useState<HealthHeaderType>(null)

  useEffect(() => {
    getHealth().then(res => {
      if (res.code === 0) setHealthStatus("ok")
      else setHealthStatus("error")
    }).catch(() => setHealthStatus('error'))
  }, [])
  return (
    <div>
      <Typography.Title level={2} style={{ marginBottom: 8 }}>
        Agent 前端
      </Typography.Title>
      <Space align='center'>
        <span>后端状态：</span>
        {healthStatus === null && <Tag>检查中…</Tag>}
        {healthStatus === "ok" && <Tag color="success">正常</Tag>}
        {healthStatus === "error" && <Tag color="error">异常或未启动</Tag>}
      </Space>
    </div>
  )
}

export default HealthHeader