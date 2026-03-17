import { http } from "@/lib/http"
import type { health } from "@/types/common"

// 获取后端健康状态
export function getHealth() {
    return http<health>("/health")
}