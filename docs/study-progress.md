# 学习进度与文档提交约定

> **学习节奏与「下一步」**；**不替代**根目录 **`readme.md`** 中的功能模块表。

---

## 最近一次学习（2026-07-24 · 跨仓 R4b.2 文档对齐）

- **backend / mcp**：附件解析已接入 Chat（正文不落库）；本仓 UI 无需改即可发 `attachment_ids`。  
- **下一步（前端）**：等 backend **失败可见 / Abort** 协议后再改停止按钮等；有 zhipu 时可顺带验「上传+提问」。  
- 详见 backend **`readme.md` §7**。

---

## 换设备继续（下一步）

1. 拉最新 **`main`**；按需补做 Network 验收（`auto` / `/dict/presets` / `preset` / 附件上传）。  
2. 不插队语音；Abort 等后端契约。  
3. 可选：有 key 时用附件问一句，确认助手能引用文件内容。

---

## 提交前约定

1. 有代码时建议 **`npm run lint`**。
2. 更新 **`readme.md`** 功能表、**`changelog.md`**、勾选 **`frontend-refactor-plan.md`**。
3. 教学默认不工具改 **`src/**`**，除非消息含 **`本次允许修改`**。
