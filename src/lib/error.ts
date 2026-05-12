import { notification } from "antd";
import { toUserErrorMessage } from "./http";

export function notifyApiError(err: unknown, title = "请求失败") {
  notification.error({
    message: title,
    description: toUserErrorMessage(err),
    placement: "topRight"
  })
}