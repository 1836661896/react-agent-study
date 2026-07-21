/** POST /artifact 成功时 data（multipart 字段名：file） */
export type ArtifactUploadData = {
  artifact_id: string
  filename: string
  mime_type: string
  size_bytes: number
  url: string
}
