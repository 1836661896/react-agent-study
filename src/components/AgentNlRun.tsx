import { useState } from "react";
import { Button, Card, Form, Input, message } from "antd";

import { runNlCommand } from "@/api/agent";
import { notifyApiError } from "@/lib/error";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function AgentNlRun() {
  const queryClient = useQueryClient()

  const [agentNlText, setAgentNlText] = useState("")

  const agentNlTextMutation = useMutation({
    mutationFn: (command: string) => runNlCommand(command),
    onSuccess: res => {
      setAgentNlText("")
      message.success(res.msg)
      queryClient.invalidateQueries({ queryKey: ["lastStep"] })
      queryClient.invalidateQueries({ queryKey: ["stepList"] })
    },
    onError: err => {
      notifyApiError(err, "执行NL命令失败")
    }

  })
  return (
    <Card title="大模型命令">
      <Form
        layout="inline"
        onFinish={() => {
          const command = agentNlText.trim()
          if (!command) return
          agentNlTextMutation.mutate(command)
        }}
      >
        <Form.Item style={{ flex: 1, marginBottom: 0 }}>
          <Input
            value={agentNlText}
            onChange={e => setAgentNlText(e.target.value)}
            placeholder="请输入对话内容"
            allowClear
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={agentNlTextMutation.isPending}>提交</Button>
        </Form.Item>
      </Form>
    </Card>
  )
}
