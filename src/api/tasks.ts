import { http } from "@/lib/http"
import type { response } from "@/types/common"
import type { Task } from "@/types/tasks"

// 获取任务列表
export function getTasks() {
    return http<response<Task[]>>("/tasks")
}

// 添加任务
export function addTasks(description: string) {
    return http<response>("tasks", {
        method: "POST",
        body: {
            description
        }
    })
}

// 删除任务
export function deleteTask(task_id: number) {
    return http<response>(`tasks/${task_id}`, {
        method: "DELETE"
    })
}