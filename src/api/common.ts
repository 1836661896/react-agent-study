import { http } from "@/lib/http"
import type { response } from "@/types/common"

// 获取后端健康状态
export function getHealth() {
  return http<response>("/health")
}