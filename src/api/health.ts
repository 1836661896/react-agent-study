import type { ApiResponse } from "@/types/common"
import { request } from "@/utils/request"

export type healthData = {
  status: string
}

export function getHealth() {
  return request<ApiResponse<healthData>>("/health")
}
