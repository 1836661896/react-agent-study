export interface response<T = unknown> {
  code: number
  data: T
  msg: string
}