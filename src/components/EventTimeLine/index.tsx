import { getEvents } from "@/api/events";
import { toUserErrorMessage } from "@/lib/http";
import type { EventItem } from "@/types/events";
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Alert, Button, Card, Space, Spin, Tag } from "antd";
import { useMemo, useState } from "react";

import "./index.scss"

export default function EventTimeLine() {
  const queryClient = useQueryClient()
  const limit = 20

  const [items, setItems] = useState<EventItem[]>([])
  const [nextCursor, setNextCursor] = useState<number | null>(null)

  const firstPageQuery = useQuery({
    queryKey: ["events", limit] as const,
    queryFn: () => getEvents({ limit }),
    staleTime: 5_000,
    refetchOnWindowFocus: false,
  })

  useMemo(() => {
    const page = firstPageQuery.data?.data
    if (!page) return
    setItems(page.items)
    setNextCursor(page.next_cursor)
  }, [firstPageQuery.data])

  const hasMore = nextCursor !== null

  async function loadMore() {
    if (!hasMore) return
    const res = await getEvents({ limit, cursor: nextCursor })
    const page = res.data
    setItems(prev => [...prev, ...page.items])
    setNextCursor(page.next_cursor)
  }

  function refresh() {
    setItems([])
    setNextCursor(null)
    queryClient.invalidateQueries({ queryKey: ["events"] })
  }

  return (
    <Card title="活动时间线 (events) ">
      <Space style={{ marginBottom: 16 }}>
        <Button onClick={refresh}>刷新</Button>
        <Button onClick={() => loadMore()} disabled={!hasMore}>
          加载更多
        </Button>
        {firstPageQuery.isError && (
          <Button onClick={() => firstPageQuery.refetch()}>重试</Button>
        )}
      </Space>

      {firstPageQuery.isLoading && <Spin />}

      {firstPageQuery.isError && (
        <Alert
          type="error"
          showIcon
          title="活动时间线加载失败"
          description={toUserErrorMessage(firstPageQuery.error)}
        />
      )}

      {!firstPageQuery.isLoading && !firstPageQuery.isError && items.length > 0 && (
        <div className="event-timeline-list">
          {items.map(e => (
            <div
              key={e.event_id}
              className="event-timeline-item"
            >
              <div className="event-timeline-head">
                <Tag color={e.ok ? "green" : "red"}>{e.ok ? "OK" : "FAIL"}</Tag>
                <Tag>{e.type}</Tag>
                <Tag>{e.endpoint}</Tag>
                <span className="event-timeline-summary">{e.summary}</span>
              </div>

              <div className="event-timeline-meta">
                {e.created_at} · request_id={e.request_id} · provider={e.provider_used}
                {e.fallback_used ? " (fallback) " : ""}
              </div>

              <pre className="event-timeline-payload">
                {JSON.stringify(e.payload, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      )}
    </Card>
  )

}