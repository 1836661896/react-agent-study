# 学习进度与文档提交约定

> **学习节奏与「下一步」**；**不替代**根目录 **`readme.md`** 中的功能模块表。

---

## 最近一次学习（2026-05-17）

- **页面目录**：聊天相关组件放在 **`src/pages/chat/components/`**，由 **`ChatPage`** 组合左右栏。
- **会话 HTTP 闭环（读 + 建）**：**`getConversationMessages`**、**`createConversation`**；右侧 **`ChatThreadPanel`**：**`useQuery`**、`enabled` 依赖选中项；列表与消息 **`queryKey`** 分离；写操作后 **`invalidateQueries`**（含 **`messages`**）。
- **状态上提**：**`ChatPage`** 持有 **`ConversationListItem | null`**，列表点击传整行快照，避免翻页后标题丢失。
- **下一步**：**`POST /chat/stream`**（SSE **`delta` / `error` / `done`**）、输入区、发送成功后刷新 **`messages`**（或本地拼接流式增量）；可选 **`GET /health`** 小部件。

---

## 最近一次学习（2026-05-16）

- **路由与会话列表**：**`react-router-dom`**（**`BrowserRouter`**）；**`App`** 下 **`HomePage` / `ChatPage` / `NotFoundPage`**；**`ChatPage`** 挂载 **`ConversationList`**。
- **API 与类型**：**`src/api/conversations.ts`**（**`list`**、**`delete`**，删除为 **`POST` + body `{ ids }`**）；**`types/common.ts`**（**`ListResult`** 等）、**`types/conversations.ts`**。
- **列表交互**：**`useQuery`** 分页；**`useMutation`** 单删/批删；**`invalidateQueries`**；多选、全选本页；翻页清空多选。
- **文档**：更新 **`readme.md`**、**`changelog.md`**、**`frontend-backend-contract.md`**、**`frontend-refactor-plan.md`**、本文件。

---

## 最近一次学习（2026-05-15）

- **R1/R2**：用户删除旧 **`src/`** 后自建最小骨架——**`utils/request.ts`**（JSON **`request` + `HttpError`**）、**`config/env.ts`**、**`types/common.ts`**、**`main.tsx` / `App.tsx`**、**`styles/`**、**`vite-env.d.ts`**；**`index.html`** → **`main.tsx`**。
- **文档**：已根据当前目录更新 **`readme.md`**、**`docs/frontend-backend-contract.md`**、**`docs/frontend-refactor-plan.md`**、**`docs/changelog.md`**（助手仅改 **`docs/`** 与 **`readme.md`**，未改 **`src/`**）。

---

## 下一次学习的起点

> 顺序以 **`docs/frontend-refactor-plan.md`** §**R** 为准。

1. **R3（续）——流式聊天**：新增 **`src/api/chatStream.ts`**（或等价模块）消费 **`POST /chat/stream`**；解析 **`delta` / `error` / `done`**；**`done`** 中取 **`conversation_id` / `turn_id`**；UI 输入框 + 发送中状态；成功后 **`invalidateQueries`**（**`messages`**）或合并展示本轮 assistant 文本。
2. **R4**：**`GET /health`** 展示（完成 **`frontend-refactor-plan`** §**1.1**）；可选 **三栏**（左占位 | 列表 | 主聊天）。
3. **R5**：**`npm run lint`**、联调、再扫 **`readme` / `frontend-backend-contract` §5**。

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
