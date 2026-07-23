# 学习进度与文档提交约定

> **学习节奏与「下一步」**；**不替代**根目录 **`readme.md`** 中的功能模块表。

---

## 最近一次学习（2026-07-23 · W8′ 收尾并提交）

- **已落地**：
  - 发送固定 **`routing: "auto"`**；去掉 chat/auto 手动切换。
  - **`GET /dict/presets`**（`types/dict` + `api/dict` + Radio 拉表）；「普通」本地；`preset?: string`。
  - antd：列表 Button/Modal/Empty/Alert；消息 Spin/Empty/Alert；工具 **Collapse**；历史图 Button。
  - **Enter 发送 / Shift+Enter 换行**（`onKeyDown` + `isComposing`）。
  - 备忘：**`docs/antd-api-notes.md`**（`Alert.title`、`Spin.description`）。
- **下一步**：**R4b.2** 附件解析联调 → Abort → plan → 语音。

---

## 换设备继续（下一步）

1. 拉最新 **`main`**；按需补做 Network 验收（`auto` / `/dict/presets` / `preset`）。
2. 开 **R4b.2**（先读 backend 附件解析契约，再改前端）。
3. 不插队语音。

---

## 提交前约定

1. 有代码时建议 **`npm run lint`**。
2. 更新 **`readme.md`** 功能表、**`changelog.md`**、勾选 **`frontend-refactor-plan.md`**。
3. 教学默认不工具改 **`src/**`**，除非消息含 **`本次允许修改`**。
