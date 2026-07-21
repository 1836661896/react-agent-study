import type { ArtifactUploadData } from "@/types/artifacts"
import type { ApiResponse } from "@/types/common"
import { HttpError } from "@/utils/request"
import { buildApiUrl } from "@/utils/url"

/** POST /artifact；表单字段名必须是 file */
export async function uploadArtifact(
  file: File,
  options?: { signal?: AbortSignal },
): Promise<ApiResponse<ArtifactUploadData>> {
  const form = new FormData()
  form.append("file", file)

  let res: Response
  try {
    res = await fetch(buildApiUrl("/artifact"), {
      method: "POST",
      body: form,
      // 不要手动设 Content-Type，浏览器会带 multipart boundary
      ...(options?.signal !== undefined ? { signal: options.signal } : {}),
    })
  } catch (e) {
    throw new HttpError({
      message: e instanceof Error ? e.message : "Network failed",
      kind: "network",
      userMessage: "上传失败：网络异常",
    })
  }

  let body: unknown
  try {
    body = await res.json()
  } catch (e) {
    throw new HttpError({
      message: e instanceof Error ? e.message : "JSON parse failed",
      status: res.status,
      kind: "parse",
      userMessage: "上传响应解析失败",
    })
  }

  if (!res.ok) {
    throw new HttpError({
      message: `HTTP ${res.status}`,
      status: res.status,
      body,
      kind: "http",
      userMessage: `上传失败（HTTP ${res.status}）`,
    })
  }

  const envelope = body as ApiResponse<ArtifactUploadData>
  if (envelope.code !== 0) {
    throw new HttpError({
      message: envelope.msg || "upload failed",
      status: 200,
      body: envelope,
      kind: "business",
      userMessage: envelope.msg || "上传失败",
    })
  }

  return envelope
}

function filenameFromContentDisposition(header: string | null): string | null {
  if (!header) return null
  const m = /filename\*?=(?:UTF-8''|")?([^";]+)/i.exec(header)
  return m?.[1] ? decodeURIComponent(m[1].replace(/"/g, "")) : null
}

/** GET /artifact/{id}：触发浏览器下载；失败抛 HttpError */
export async function downloadArtifact(artifactId: string): Promise<void> {
  let res: Response
  try {
    res = await fetch(buildApiUrl(`/artifact/${artifactId}`))
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
      userMessage: body.msg || "文件不存在或无法下载。",
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
