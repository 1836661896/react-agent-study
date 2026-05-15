# 学习进度与文档提交约定

> **学习节奏与「下一步」**；**不替代**根目录 **`readme.md`** 中的功能模块表。

---

## 最近一次学习（2026-05-15）

- **聊天模块目录**：**`/chat`** 入口为 **`src/pages/chat/index.tsx`**；**`ConversationList/`**、**`ChatThreadPanel/`** 各自 **`index.tsx` + `index.scss`**；全局一屏布局见 **`styles/App.scss`**、**`styles/main.scss`**（**`#root` 高度链** + **`Layout` 主区 `flex`/`min-height:0`**，避免整页滚动条）。
- **SSE**：**`src/api/chatStream.ts`**、**`src/types/chatStream.ts`**；**`fetch` + `ReadableStream`** 解析 **`data:`** 行；**`delta` / `error` / `done`** 与 **`invalidateQueries`**（**`messages` infinite**、**`list`**）配合；右侧乐观气泡与贴底滚动等见 **`ChatThreadPanel`**。
- **消息历史分页**：**`useInfiniteQuery`** 向前翻页、「加载更多」与（可选）滚顶自动加载；**`getNextPageParam`** 与 **`p.data?.records`** 空安全。
- **列表分页边界**：在最后一页删光本会话后 **`page` 可能大于 `maxPage`**，用 **`useEffect`** 将 **`page` 夹到合法范围**，避免空列表假象。
- **选中行与标题同步**：**`ChatPage`** 对 **`queryCache.subscribe`**，从各页 **`['conversations','list',…]`** 缓存中按 **`id`** 合并 **`memory_title` / `memory_updated_at` / `kind`** 到 **`selectedItem`**，列表刷新后右侧标题与左侧一致。
- **时间展示**：**`src/utils/datetime.ts`** 的 **`formatDisplayDateTime`**，列表与消息气泡统一引用。
- **下一步**：**`GET /health`** 小部件；**`npm run lint`** 与 **`readme` / `frontend-backend-contract` §5** 再扫一轮；可选 **三栏左占位**、**`routing`** 快捷、流式 **Abort**。

---

## 最近一次学习（2026-05-17）

- **页面目录**：聊天相关组件放在 **`src/pages/chat/components/`**，由 **`ChatPage`** 组合左右栏。
- **会话 HTTP 闭环（读 + 建）**：**`getConversationMessages`**、**`createConversation`**；右侧 **`ChatThreadPanel`**：**`useQuery`**、`enabled` 依赖选中项；列表与消息 **`queryKey`** 分离；写操作后 **`invalidateQueries`**（含 **`messages`**）。
- **状态上提**：**`ChatPage`** 持有 **`ConversationListItem | null`**，列表点击传整行快照，避免翻页后标题丢失。
- **说明**：目录已演进为 **`pages/chat/index.tsx`** + **`ConversationList/`**、**`ChatThreadPanel/`** 子包；消息查询已由单页 **`useQuery`** 扩展为 **`useInfiniteQuery`** 等，以当前磁盘 **`src/`** 与 **`readme.md`** §2 为准。

---

## 最近一次学习（2026-05-16）

- **路由与会话列表**：**`react-router-dom`**（**`BrowserRouter`**）；**`App`** 下 **`HomePage` / `ChatPage` / `NotFoundPage`**；**`ChatPage`** 挂载 **`ConversationList`**。
- **API 与类型**：**`src/api/conversations.ts`**（**`list`**、**`delete`**，删除为 **`POST` + body `{ ids }`**）；**`types/common.ts`**（**`ListResult`** 等）、**`types/conversations.ts`**。
- **列表交互**：**`useQuery`** 分页；**`useMutation`** 单删/批删；**`invalidateQueries`**；多选、全选本页；翻页清空多选。
- **文档**：更新 **`readme.md`**、**`changelog.md`**、**`frontend-backend-contract.md`**、**`frontend-refactor-plan.md`**、本文件。

---

## 最近一次学习（2026-05-15 · R1/R2 骨架）
- **文档**：已根据当前目录更新 **`readme.md`**、**`docs/frontend-backend-contract.md`**、**`docs/frontend-refactor-plan.md`**、**`docs/changelog.md`**（助手仅改 **`docs/`** 与 **`readme.md`**，未改 **`src/`**）。

---

## 下一次学习的起点

> 顺序以 **`docs/frontend-refactor-plan.md`** §**R** 为准。

1. **R4 / R5**：**`GET /health`** 展示（**`frontend-refactor-plan`** §**1.1**）；**`npm run lint`**、联调、更新 **`readme` / `frontend-backend-contract` §5** 与 **`changelog`**。
2. **可选**：三栏左占位；**`routing`** 快捷；流式 **AbortController**「停止生成」；消息区 **`turn_id`** 展示或调试。
3. **阶段 4 预备**：SSE 事件类型扩展、富消息块（以后端契约为准）。

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
