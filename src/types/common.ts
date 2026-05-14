// 通用 API 响应
export type ApiResponse<T = unknown> = {
  code: number
  data: T
  msg: string
}

// 列表查询参数
export type ListQuery = {
  page: number
  limit: number
}

// 列表查询结果
export type ListResult<T = unknown> = {
  records: T[]
  total: number
  page: number
  limit: number
}
