import { env } from "@/config/env";
import type { ApiResponse } from "@/types/common";

export type HttpErrorKind = "network" | "http" | "parse" | "business" | "unknown"

export class HttpError extends Error {
  readonly status: number
  readonly body: unknown
  readonly kind: HttpErrorKind
  readonly userMessage: string

  constructor(params: {
    message: string
    status?: number
    body?: unknown
    kind: HttpErrorKind
    userMessage?: string
  }) {
    super(params.message)
    this.name = "HttpError"
    this.status = params.status ?? 0
    this.body = params.body  ?? null
    this.kind = params.kind
    this.userMessage = params.userMessage ?? params.message
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
    for(const [k, v] of Object.entries(query)) {
      if (v === undefined || v === null) continue
      url.searchParams.set(k, String(v))
    }
  }
  return url.toString()
}

function isApiEnvelope(x: unknown): x is ApiResponse {
  return !!x && typeof x === "object" && "code" in x && typeof (x as ApiResponse).code === "number"
}


export async function request<T>(path: string, options: HttpOptions = {}): Promise<T> {
  let res: Response
  try {
    res = await fetch(buildUrl(path, options.query), {
      method: options.method ?? "get",
      headers: {
        ...(options.body ? {"Content-Type": "application/json"} : {}),
        ...options.headers
      },
      ...(options.body !== undefined && options.body !== null
        ? { body: JSON.stringify(options.body) }
        : {}),
      ...(options.signal !== undefined ? { signal: options.signal } : {}),
    })
  } catch (e) {
    throw new HttpError({
      message: e instanceof Error ? e.message : "Network request failed",
      kind: "network",
      userMessage: "网络异常，请检查后端服务或本地网络"
    })
  }
  
  const contentType = res.headers.get("contnet-type") ?? ""
  const isJson = contentType.includes("application/json")
  let data: unknown
  if(isJson) {
    try {
      data = await res.json()
    } catch (e) {
      throw new HttpError({
        message: e instanceof Error ? e.message : "JSON parse failed",
        status: res.status,
        kind: "parse",
        userMessage: "响应解析失败，请稍后重试"
      })
    }
  } else {
    try {
      data = await res.text()
    } catch {
      data = ""
    }
  }

  if(!res.ok) {
    throw new HttpError({
      message: `Request failed: ${res.status}`,
      status: res.status,
      body: data,
      kind: "http",
      userMessage: `请求失败（HTTP ${res.status}）`
    })
  }

  if(isJson && isApiEnvelope(data) && data.code !== 0) {
    throw new HttpError({
      message: data.msg || "Business error",
      status: 200,
      body: data,
      kind: "business",
      userMessage: data.msg || "业务处理失败"
    })
  }

  return data as T
}