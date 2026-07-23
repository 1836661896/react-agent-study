/** GET /dict/{dict_key} 单条；身份时 value → chat/stream 的 preset */
export type DictItem = {
  label: string
  value: string
}

/** data（无分页，勿套 ListResult） */
export type DictListData = {
  records: DictItem[]
}