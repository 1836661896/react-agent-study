import { env } from "@/config/env"

/** 拼接后端 API 绝对 URL；JSON 与 SSE 共用 */
export function buildApiUrl(
  path: string,
  query?: Record<string, string | number | boolean | undefined | null | unknown>,
): string {
  const base = env.apiBaseUrl.replace(/\/$/, "")
  const p = path.startsWith("/") ? path : `/${path}`
  const url = new URL(`${base}${p}`)
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v === undefined || v === null) continue
      url.searchParams.set(k, String(v))
    }
  }
  return url.toString()
}
