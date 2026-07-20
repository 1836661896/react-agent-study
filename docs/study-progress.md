# 学习进度与文档提交约定

> **学习节奏与「下一步」**；**不替代**根目录 **`readme.md`** 中的功能模块表。

---

## 最近一次学习（2026-07-20 · W1 完成 + W2 半截）

- **W1 ✅**：`request.ts`、`api/health`、顶栏 **HealthBage**。
- **W2 进行中**：
  - ✅ `types/common`（`ListQuery` / `ListResult`）
  - ✅ `types/conversations`（`updated_at`、`attachments`）
  - ✅ `api/conversations`（list / create / delete / messages）
  - ✅ `types/chatStream`（`preset=guide`、`attachment_ids`；SSE 字段对齐后端 `text`/`msg`/`tool`）
  - ⏳ **`api/chatStream.ts`**（SSE 对接）← **下次优先**
  - ⏳ `artifacts` 类型 + api（upload / download）
- **教学约定**：UI 严格 **①DOM → ②CSS → ③引用 → ④逻辑**；单独回复 **`1`** = 当前步完成。

---

## 换设备继续（下一步）

1. 拉最新 **`main`**；确认 **`backup/src/`** 在。
2. 打开 **`docs/frontend-refactor-plan.md`** §**W2** / 本文件。
3. **优先**：写 **`src/api/chatStream.ts`**（默认 **`routing=chat`**；勿抄旧 backup 的默认 `auto`）；对照已有 **`types/chatStream.ts`** 与 backend **`sse_events.py`**。
4. 然后 artifacts 类型 + api；勾选 W2 后再进 **W3** 双栏 DOM。

---

## 提交前约定

1. 有代码时建议 **`npm run lint`**。
2. 更新 **`readme.md`** 功能表、**`changelog.md`**、勾选 **`frontend-refactor-plan.md`**。
3. 教学默认不工具改 **`src/**`**，除非消息含 **`本次允许修改`**。
