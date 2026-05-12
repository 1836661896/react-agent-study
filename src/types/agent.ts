export type Step = {
  tool_name: string
  input_text: string
  ok_flag: boolean
  msg: string
  timestamp: string
}

export type AgentResult = {
  result: unknown
  tool_msg?: string
  command: string
}

export type Msg = {
  role: "user" | "assistant"
  content: string
}