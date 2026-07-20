const ARTIFACT_ID_RE =
  /artifact_id:\s*([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i

// 从 MCP tool_result 文本中提取 artifact_id；没有则 null
export function parseArtifactIdFromToolResult(text: string): string | null {
  const m = text.match(ARTIFACT_ID_RE)
  return m?.[1] ?? null
}
