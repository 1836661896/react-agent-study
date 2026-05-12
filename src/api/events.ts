import { http } from "@/lib/http";
import type { response } from "@/types/common";
import type { EventsPage } from "@/types/events";

export function getEvents(query: { limit?: number; cursor?: number | null }) {
  return http<response<EventsPage>>("events", {
    method: "get",
    query
  })
}