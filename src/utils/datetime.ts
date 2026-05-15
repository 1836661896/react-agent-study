/**
 * 将后端 ISO / 时间字符串格式化为本地可读时间，供列表与消息气泡统一展示。
 */
function pad2(n: number): string {
  return String(n).padStart(2, "0")
}

/**
 * @param value ISO 8601 字符串、时间戳数字或 Date；空值返回「—」
 * @returns 形如 `2026-05-15 14:30:02` 的本地时间（24 小时制）
 */
export function formatDisplayDateTime(
  value: string | number | Date | null | undefined,
): string {
  if (value === null || value === undefined || value === "") return "—"

  const d = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(d.getTime())) {
    return typeof value === "string" ? value : "—"
  }

  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())} ${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`
}
