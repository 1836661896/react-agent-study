
import { HttpError } from "@/utils/request"

export function errorDescription(err: unknown): string {
  if (err instanceof HttpError) return err.userMessage
  if (err instanceof Error) return err.message || "请求失败"
  return "请求失败"
}