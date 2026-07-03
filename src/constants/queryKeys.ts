/** TanStack Query 缓存 key；与 coding-react-components.mdc 约定一致 */

export const queryKeys = {
  health: () => ["health"] as const,
  conversations: {
    list: (page: number, limit: number) =>
      ["conversations", "list", page, limit] as const,
    listRoot: () => ["conversations", "list"] as const,
    messagesRoot: () => ["conversations", "messages"] as const,
    messagesInfinite: (conversationId: number, pageSize: number) =>
      ["conversations", "messages", "infinite", conversationId, pageSize] as const,
  },
} as const
