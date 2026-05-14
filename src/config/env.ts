const raw = import.meta.env.VITE_API_BASE_URL
if (typeof raw !== "string" || !raw.trim()) {
  throw new Error(
    "缺少环境变量 VITE_API_BASE_URL，请在 .env.development 中配置",
  )
}

export const env = {
  apiBaseUrl: raw.replace(/\/$/, ""),
} as const
