# 学习进度与文档提交约定

> **学习节奏与「下一步」**；**不替代**根目录 **`readme.md`** 中的功能模块表。

---

## 最近一次学习（2026-05-15）

- **R1/R2**：用户删除旧 **`src/`** 后自建最小骨架——**`utils/request.ts`**（JSON **`request` + `HttpError`**）、**`config/env.ts`**、**`types/common.ts`**、**`main.tsx` / `App.tsx`**、**`styles/`**、**`vite-env.d.ts`**；**`index.html`** → **`main.tsx`**。
- **文档**：已根据当前目录更新 **`readme.md`**、**`docs/frontend-backend-contract.md`**、**`docs/frontend-refactor-plan.md`**、**`docs/changelog.md`**（助手仅改 **`docs/`** 与 **`readme.md`**，未改 **`src/`**）。

---

## 下一次学习的起点

> 顺序以 **`docs/frontend-refactor-plan.md`** §**R** 为准。

1. **R3**：新增 **`src/types/conversation.ts`**（及流式所需类型）、**`src/api/conversation.ts`**、**`src/api/chatStream.ts`**（**`done` 含 `conversation_id` / `turn_id`**）；由你本地改 **`src/`**，或同条消息含 **`本次允许修改`** 并写明范围后请助手代写。
2. **R4**：三栏布局（左占位 | 会话列表 | 聊天）、**`useQuery`**、**`GET /health`** 展示（完成 **§1.1** 勾选）。
3. **R5**：**`npm run lint`**、联调、再扫一遍 **`readme` / `frontend-backend-contract` §5**。

---

## 提交前约定（仅文档）

> 当你说「准备提交代码 / 提交代码」且**本意是更新学习记录**时，可默认只提交文档，避免与业务源码大 diff 混在一起。

### 建议纳入的文档范围

- 根目录 **`readme.md`**
- **`docs/documentation-index.md`**、**`docs/changelog.md`**、**`docs/study-progress.md`**、**`docs/frontend-backend-contract.md`**、**`docs/frontend-refactor-plan.md`**、**`docs/product-roadmap.md`**、**`docs/collaboration-and-coding-rules.md`**
- **`.cursor/rules/frontend-project-goal.mdc`**、**`frontend-study-plan.mdc`**、**`react-learning-checklist.mdc`**

### 每次文档提交前

1. 更新 **`readme.md`** 中「功能模块与实现程度」表（若代码有变）。
2. 更新本文件「最近一次学习 / 下一次起点」；有重大结构变更时追加 **`changelog.md`**。
3. 视情况勾选 **`react-learning-checklist.mdc`**。

---

## 教学风格（摘要）

- 用户有 Vue 背景、初学 React：助手以「Vue → React」对照讲解；**默认不工具修改 `src/`**，除非用户同条消息含 **`本次允许修改`** 并写清范围（详见 **`frontend-project-goal.mdc`**）。
