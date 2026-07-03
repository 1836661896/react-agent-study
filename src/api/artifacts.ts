import type { ApiResponse } from "@/types/common"
import { HttpError } from "@/utils/request"
import { buildApiUrl } from "@/utils/url"

function filenameFromContentDisposition(header: string | null): string | null {
  if (!header) return null
  const m = /filename\*?=(?:UTF-8''|")?([^";]+)/i.exec(header)
  return m?.[1] ? decodeURIComponent(m?.[1].replace(/"/g, "")) : null
}

// 请求 GET /artifact/{id}，出发浏览器下载；失败抛 HttpError
export async function downloadArtifact(artifactId: string): Promise<void> {
  const url = buildApiUrl(`artifact/${artifactId}`)
  let res: Response
  try {
    res = await fetch(url)
  } catch (e) {
    throw new HttpError({
      message: e instanceof Error ? e.message : "Network failed",
      kind: "network",
      userMessage: "下载失败：网络异常",
    })
  }

  const contentType = res.headers.get("content-type") ?? ""
  if (contentType.includes("application/json")) {
    const body = (await res.json()) as ApiResponse<unknown>
    throw new HttpError({
      message: body.msg || "artifact download failed",
      status: res.status,
      body,
      kind: "business",
      userMessage: body.msg || "工件不存在或无法下载",
    })
  }

  if (!res.ok) {
    throw new HttpError({
      message: `HTTP ${res.status}`,
      status: res.status,
      kind: "http",
      userMessage: `下载失败（HTTP ${res.status}）`,
    })
  }

  const blob = await res.blob()
  const name =
    filenameFromContentDisposition(res.headers.get("content-disposition")) ??
    `artifact-${artifactId}`
  const objectUrl = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = objectUrl
  a.download = name
  a.rel = "noopener"
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(objectUrl)
}
