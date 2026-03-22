import { env } from "@/config/env"
import type { response } from "@/types/common"

export class HttpError extends Error {
  status: number
  body: unknown

  constructor( message: string, status: number, body: unknown) {
    super(message)
    this.name = "HttpError"
    this.status = status
    this.body = body
  }
}

type HttpOptions = {
  method?: "get" | "post" | "put" | "patch" | "delete"
  query?: Record<string, string | number | boolean | undefined | null>
  body?: unknown
  headers?: Record<string, string>
  signal?: AbortSignal
}

function buildUrl(path: string, query?: HttpOptions["query"]) {
  const base = env.apiBaseUrl.replace(/\/$/, "")
  const p = path.startsWith("/") ? path : `/${path}`
  const url = new URL(`${base}${p}`)

  if(query) {
    for (const [k, v] of Object.entries(query)) {
      if(v === undefined || v === null) continue
      url.searchParams.set(k, String(v))
    }
  }

  return url.toString()
}

export async function http<T>(path: string, options: HttpOptions = {}): Promise<T> {
  const res = await fetch(buildUrl(path, options.query), {
    method: options.method ?? "get",
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers
    },
    body: options.body ? JSON.stringify(options.body) : null,
    signal: options.signal ?? null
  })

  const contentType = res.headers.get("content-type") ?? ""
  const isJson = contentType.includes("application/json")
  const data = isJson ? await res.json().catch( () => null) : await res.text().catch( () => "")

  if (!res.ok) throw new HttpError(`Request failed: ${res.status}`, res.status, data)

  function isApiEnvelope(x: unknown): x is response {
    return !!x && typeof x === "object" && "code" in x && typeof x.code === "number"
  }

  if(isJson && isApiEnvelope(data)) {
    if(data.code !== 0) {
      throw new HttpError(data.msg || "请求失败", 200, data)
    }
  }

  return data as T
}
