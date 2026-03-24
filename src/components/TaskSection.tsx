import { addTasks, deleteTask, getTasks } from "@/api/tasks";
import { toUserErrorMessage } from "@/lib/http";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert, Button, Card, Empty, Form, Input, List, message, Spin } from "antd";
import { useState } from "react";

export function TaskSection() {
  const [newTaskName, setNewTaskName] = useState("")

  const queryClient = useQueryClient()

  // 添加任务
  const addTaskMutation = useMutation({
    mutationFn: (desc: string) => addTasks(desc),
    onSuccess: res => {
      message.success(res.msg)
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
    },
    onError: err => {
      message.error(toUserErrorMessage(err))
    }
  })

  // 删除任务
  const deleteTaskMutation = useMutation({
    mutationFn: (task_id: number) => deleteTask(task_id),
    onSuccess: res => {
      message.success(res.msg)
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
    },
    onError: err => {
      message.error(toUserErrorMessage(err))
    }
  })

  // 获取任务列表
  const taskQuery = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks
  })

  const taskList = taskQuery.data?.data ?? []
  /** 添加任务：空内容时是否弹出提示（表单提交要提示，输入框回车不提示） */
  const tryAddTask = (warnWhenEmpty: boolean) => {
    const v = newTaskName.trim()
    if (!v) {
      if (warnWhenEmpty) message.warning("请输入任务内容")
      return
    }
    addTaskMutation.mutate(v)
    setNewTaskName("")
  }
  return (
    <Card title="任务列表">
      <Form
        layout='inline'
        onFinish={() => tryAddTask(true)}
        style={{ marginBottom: 16 }}
      >
        <Form.Item style={{ flex: 1, minWidth: 200, marginBottom: 0 }}>
          <Input
            value={newTaskName}
            onChange={e => setNewTaskName(e.target.value)}
            placeholder="请输入任务内容，回车键添加"
            allowClear
            onPressEnter={() => tryAddTask(false)}
          />
        </Form.Item>
        <Form.Item style={{ marginBottom: 0 }}>
          <Button type='primary' htmlType='submit' loading={addTaskMutation.isPending}>
            添加
          </Button>
        </Form.Item>
      </Form>

      <Spin spinning={taskQuery.isLoading}>
        {taskQuery.isError && (
          <Alert type='error' title="任务列表加载失败" showIcon description={toUserErrorMessage(taskQuery.error)} />
        )}
        {!taskQuery.isLoading && !taskQuery.isError && taskList.length === 0 && (
          <Empty description="暂无任务" />
        )}
        {!taskQuery.isError && !taskQuery.isLoading && taskList.length > 0 && (
          <List
            bordered
            dataSource={taskList}
            renderItem={t => (
              <List.Item
                actions={[
                  <Button
                    key="del"
                    danger
                    size='small'
                    loading={
                      deleteTaskMutation.isPending &&
                      deleteTaskMutation.variables === t.task_id
                    }
                    onClick={() => deleteTaskMutation.mutate(t.task_id)}
                  >
                    删除
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  title={`#${t.task_id} ${t.task_name}`}
                />
              </List.Item>
            )}
          />
        )}
      </Spin>
    </Card>
  )
}

export default TaskSection