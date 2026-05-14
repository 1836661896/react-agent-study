export type ApiResponse<T = unknown> = {
  code: number
  data: T
  msg: string
}