import { http } from "@/lib/http"
import type { response } from "@/types/common"
import type { Step } from "@/types/agent"

// 调用agent
export function runAgent(text: string) {
  return http<response<unknown>>("agent/run", {
    method: "post",
    body: { text }
  })
}

// 获取agent最后一次操作记录
export function getLastStep() {
  return http<response<Step>>("agent/last-step")
}

// 获取操作列表
export function getStepList(limit: number) {
  return http<response<Step[]>>("agent/steps", {
    method: "get",
    query: {
      limit
    }
  })
}
