import { runAgent } from "@/api/agent"
import { toUserErrorMessage } from "@/lib/http"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Button, Card, Form, Input, message } from "antd"
import { useState } from "react"

export default function AgentCommand() {
  const queryClient = useQueryClient()
  // 调用命令集
  const [agentCommand, setAgentCommand] = useState("")
  const agentCommandMutation = useMutation({
    mutationFn: (command: string) => runAgent(command),
    onSuccess: res => {
      if (typeof res.data === "string") {
        message.success(res.data)
        queryClient.invalidateQueries({ queryKey: ["lastStep"] })
        queryClient.invalidateQueries({ queryKey: ["stepList"] })
      } else {
        message.success(res.msg)
        queryClient.invalidateQueries({ queryKey: ["lastStep"] })
        queryClient.invalidateQueries({ queryKey: ["stepList"] })
      }
    },
    onError: err => {
      message.error(toUserErrorMessage(err))
    }
  })
  return (
    <Card title="Agent 命令">
      <Form
        layout='inline'
        onFinish={() => {
          const command = agentCommand.trim()
          if (!command) return
          agentCommandMutation.mutate(command)
          setAgentCommand("")
        }}
      >
        <Form.Item style={{ flex: 1, marginBottom: 0 }}>
          <Input
            value={agentCommand}
            onChange={e => setAgentCommand(e.target.value)}
            placeholder='请输入agent命令'
            allowClear
          />
        </Form.Item>
        <Form.Item>
          <Button type='primary' htmlType='submit' loading={agentCommandMutation.isPending}>提交</Button>
        </Form.Item>
      </Form>
    </Card>
  )
}