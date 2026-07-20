import type { ApiResponse } from "@/types/common"
import { request } from "@/utils/request"

export function getHealth(): Promise<ApiResponse<null>> {
  return request<ApiResponse<null>>("health")
}
