import type { AgentPreset, RoutingMode } from "@/types/chatStream"
import type { ConversationListItem } from "@/types/conversations"

/** 用户可选的对话模式；MCP 由 auto 或后续「能力按钮」触发，不在此暴露 */
export type ChatUiRoutingMode = Extract<RoutingMode, "auto" | "chat">

export const CHAT_ROUTING_OPTIONS: {
  label: string
  value: ChatUiRoutingMode
}[] = [
  { label: "自动", value: "auto" },
  { label: "对话", value: "chat" },
]

/** 乐观展示用：尚未写入服务端列表的用户气泡 */
export type OptimisticUserBubble = {
  key: string
  content: string
}

/** 工具调用轨迹 */
export type ToolTrace = {
  tool: string
  phase: "calling" | "result"
  arguments?: Record<string, unknown>
  resultText?: string
  isError?: boolean
  artifactId?: string
}

/** 组件 props */
export type ChatThreadPanelProps = {
  conversation: ConversationListItem | null
  preset?: AgentPreset | null
}

/** 组件 hooks 参数 */
export type UseChatThreadPanelParams = {
  conversation: ConversationListItem | null
  preset: AgentPreset | null
}
