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

  const contentDisposition = res.headers.get("content-disposition")
  const contentType = res.headers.get("content-type") ?? ""

  // 有附件头 → 成功文件（含 .json / .jpeg），不要用 Content-Type 判失败
  if (contentDisposition) {
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
      filenameFromContentDisposition(contentDisposition) ??
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
    return
  }

  // 无附件头：仅当信封带 code 且非 0 才当业务错误
  if (contentType.includes("application/json")) {
    const body = (await res.json()) as { code?: number; msg?: string }
    if (typeof body.code === "number" && body.code !== 0) {
      throw new HttpError({
        message: body.msg || "artifact download failed",
        status: res.status,
        body,
        kind: "business",
        userMessage: body.msg || "文件不存在或无法下载。",
      })
    }
    // 非信封 JSON（或缺 code）：仍触发下载
    const blob = new Blob([JSON.stringify(body)], {
      type: "application/json",
    })
    const objectUrl = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = objectUrl
    a.download = `artifact-${artifactId}.json`
    a.rel = "noopener"
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(objectUrl)
    return
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
  const name = `artifact-${artifactId}`
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
