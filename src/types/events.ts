export type EventItem = {
  event_id: number
  type: string
  endpoint: string
  request_id: string
  ok: boolean
  provider_used: string
  fallback_used: boolean
  summary: string
  payload: Record<string, unknown>
  created_at: string
}

export type EventsPage = {
  items: EventItem[]
  next_cursor: number | null
}