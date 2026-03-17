import './App.css'
import { useState, useEffect } from 'react'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { addTasks, deleteTask, getTasks } from './api/tasks'
import { getHealth } from './api/common'

function App() {
  const [healthStatus, setHealthStatus] = useState<"ok" | "error" | null>(null)
  const [newTaskName, setNewTaskName] = useState("")

  useEffect(() => {
    getHealth().then( res => {
      if( res.status === "ok" ) setHealthStatus("ok")
      else setHealthStatus("error")
    }).catch(() => setHealthStatus('error'))
  }, [])

  const queryClient = useQueryClient()

  // 添加任务
  const addTaskMutation = useMutation({
    mutationFn: (desc: string) => addTasks(desc),
    onSuccess: res => {
      alert(res.msg)
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
    },
    onError: err => {
      alert(err.message)
    }
  })

  // 删除任务
  const deleteTaskMutation = useMutation({
    mutationFn: (task_id: number) => deleteTask(task_id),
    onSuccess: res => {
      alert(res.msg)
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
    }
  })

  const { data, isLoading, isError } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks
  })

  const taskList = data?.data ?? []

  return (
    <main className="app">
      <h1>Agent 前端</h1>
      <p className="health">
        后端状态：
        {healthStatus === null && '检查中…'}
        {healthStatus === 'ok' && '正常'}
        {healthStatus === 'error' && '异常或未启动'}
      </p>

      

      <section>
        <h2>任务列表</h2>

        <form
          onSubmit={ e => {
            e.preventDefault()
            const v = newTaskName.trim()
            if(!v) return
            console.log("准备添加任务：", v)
            addTaskMutation.mutate(v)
            setNewTaskName("")
          }}
        >
          <input
            value={ newTaskName }
            onChange={ e => setNewTaskName(e.target.value)}
            placeholder="请输入任务内容，回车键添加"
          />
          <button type="submit" disabled={addTaskMutation.isPending}>
            {addTaskMutation.isPending ? "添加中..." : "添加"}
          </button>
        </form>

        {isLoading && <p>加载中。。。</p>}
        {isError && <p>加载失败</p>}
        {!isLoading && !isError && (
          taskList.length === 0 ? (
            <p>暂无任务</p>
          ) : (
            <ul>
              {taskList.map( t => (
                <li key={t.task_id}>
                  {t.task_id}: {t.task_name}
                  <button onClick={
                    () => deleteTaskMutation.mutate(t.task_id)
                  }>删除</button>
                </li>
              ))}
            </ul>
          )
        )}
      </section>
    </main>
  )
}

export default App
