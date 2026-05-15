export type ChatStreamSseEvent =
  | { type: "delta"; text: string }
  | { type: "error"; msg: string }
  | { type: "done"; conversation_id: number | null; turn_id: string }

export type ChatStreamSseEventType = ChatStreamSseEvent["type"]

export type PostChatStreamBody = {
  message: string
  conversation_id: number | null
  routing?: string
}
