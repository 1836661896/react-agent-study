import type { ApiResponse } from "@/types/common"
import type { DictListData } from "@/types/dict"
import { request } from "@/utils/request"

export function getDict(dictKey: string) {
  return request<ApiResponse<DictListData>>(
    `/dict/${encodeURIComponent(dictKey)}`,
  )
}
