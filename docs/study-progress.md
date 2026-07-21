# 学习进度与文档提交约定

> **学习节奏与「下一步」**；**不替代**根目录 **`readme.md`** 中的功能模块表。

---

## 最近一次学习（2026-07-21 · W6 tool 抽屉 ①②）

- **W6 续**：工具区 UX 定为 **持久抽屉**（非流式临时气泡）——有 `tool_*` 数据时默认展开；流结束后自动收起；数据保留，可手动再开。
- **已做**：① DOM 占位（`chat-page__tool-drawer`）+ ② CSS（`is-open` 展开/收起）。
- **未做**：③ `onToolCall` / `onToolResult` 壳；④ `toolItems` + `toolsOpen` 真实数据与开合逻辑。
- **教学约定**：UI 严格 **①DOM → ②CSS → ③引用 → ④逻辑**；单独回复 **`1`**。

---

## 换设备继续（下一步）

1. 拉最新 **`main`**。
2. 打开 **`docs/frontend-refactor-plan.md`** §**W6**。
3. **立刻**：W6 tool 抽屉 **③ handlers → ④ 逻辑**（接 SSE；来数据默认开、流结束默认关、可再开）。
4. 然后 **W7** 附件 UI（upload → `attachment_ids` → 历史下载）。

---

## 提交前约定

1. 有代码时建议 **`npm run lint`**。
2. 更新 **`readme.md`** 功能表、**`changelog.md`**、勾选 **`frontend-refactor-plan.md`**。
3. 教学默认不工具改 **`src/**`**，除非消息含 **`本次允许修改`**。
