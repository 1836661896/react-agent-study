# 学习进度与文档提交约定

> **学习节奏与「下一步」**；**不替代**根目录 **`readme.md`** 中的功能模块表。

---

## 最近一次学习（2026-07-21 · W2～W6 主路径）

- **W2 ✅**：`api/chatStream`（默认 **`chat`**）；`types/artifacts` + `api/artifacts`。
- **W3～W4 ✅**：`/chat` 双栏 DOM + 一屏高度 CSS。
- **W5 ✅**：`ConversationList` — list / create / delete；选中抬到父 state。
- **W6 🔄**：`ChatThreadPanel` — messages Query；SSE 发送（**`preset=guide`**）；乐观用户气泡；**`routing`：`chat` | `auto`**。
  - **未做**：`tool_call` / `tool_result` 展示。
- **教学约定**：UI 严格 **①DOM → ②CSS → ③引用 → ④逻辑**；单独回复 **`1`**；注释风格保持「变量/方法均有注释」。

---

## 换设备继续（下一步）

1. 拉最新 **`main`**。
2. 打开 **`docs/frontend-refactor-plan.md`** §**W6**。
3. **优先**：SSE **`tool_*`** 展示（选 `auto` 触发工具时可见）。
4. 然后 **W7** 附件 UI（upload → `attachment_ids` → 历史下载）。

---

## 提交前约定

1. 有代码时建议 **`npm run lint`**。
2. 更新 **`readme.md`** 功能表、**`changelog.md`**、勾选 **`frontend-refactor-plan.md`**。
3. 教学默认不工具改 **`src/**`**，除非消息含 **`本次允许修改`**。
