import type { ConversationListItem } from "@/types/conversations"

export type ConversationListProps = {
  selectedId: number | null
  onSelectConversation: (item: ConversationListItem | null) => void
}
