export type ApiResponse<T = unknown> = {
  code: number
  data: T
  msg: string
}

export type ListQuery = {
  page: number
  limit: number
}

export type ListResult<T = unknown> = {
  records: T[]
  total: number
  page: number
  limit: number
}
