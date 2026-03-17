export interface health {
    status: "ok" | "error" | null
    data: string
}

export interface response<T = unknown> {
    code: number
    data: T
    msg: string
}