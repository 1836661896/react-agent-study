# 变更流水（文档与工程）

> 偏「历史追溯」；**当前功能与架构**以根目录 **`readme.md`** 为准。

---

## 2026-05-17（健康检查、MCP 工具事件、对话模式）

- **健康检查**：**`src/api/health.ts`**；**`src/components/HealthBage.tsx`**（顶栏 **`useQuery`**，30s 轮询）；**`App.tsx`** 顶栏右侧展示。
- **SSE 扩展**：**`types/chatStream.ts`** 增加 **`tool_call` / `tool_result`**；**`PostChatStreamBody`** 中 **`mcp_tool?`** 可选（供后续能力按钮）；**`api/chatStream.ts`** 增加 **`onToolCall` / `onToolResult`** 分发。
- **聊天区**：**`ChatThreadPanel`** — 流式 **工具条**（**`toolTrace`**）；发送模式 Segmented 仅 **「自动 / 对话」**（**`ChatUiRoutingMode`**），不在 UI 暴露 **MCP**；**`auto→mcp`** 仍展示工具过程。
- **样式**：**`ChatThreadPanel/index.scss`** 工具参数与 composer 间距；**`App.scss`** 顶栏左右分布。
- **质量**：**`npm run lint`** 通过（提交前建议再跑一遍）。
- **文档**：**`readme.md`**、**`frontend-backend-contract.md` §5**、**`study-progress.md`**、**`frontend-refactor-plan.md`**、**`product-roadmap.md`**、**`documentation-index.md`**、规则 **`.cursor/rules/*`** 同步。

---

## 2026-05-15（聊天与工程体验）

- **目录**：**`/chat`** 实现迁至 **`src/pages/chat/index.tsx`**；**`ConversationList/`**、**`ChatThreadPanel/`**（各含 **`index.scss`**）；路由仍由 **`App.tsx`** 指向 **`./pages/chat`**（或等价懒加载路径以仓库为准）。
- **SSE**：新增 **`src/api/chatStream.ts`**、**`src/types/chatStream.ts`**；**`POST /chat/stream`** 按行解析 **`data:`** 后 **`delta` / `error` / `done`**；发送成功后 **`invalidateQueries`**（**`conversations/messages/infinite`**、**`list`** 等）。
- **消息区**：**`useInfiniteQuery`** 拉历史、向前翻页与滚动锚点；输入区与流式预览、乐观用户气泡等（见 **`ChatThreadPanel`**）。
- **列表**：删空最后一页后 **`page` 越界** 导致空 **`records`** 时，**`useEffect`** 将 **`page` 夹到 `maxPage`**；**`ChatPage`** 订阅 **`queryCache`**，从列表缓存合并选中会话 **`memory_title`** 等，避免右侧标题滞后。
- **时间**：**`src/utils/datetime.ts`** — **`formatDisplayDateTime`**，列表与消息时间统一格式化。
- **布局**：**`html, body, #root` 高度**与 **`App.scss`** 中 **`Layout` 主区 flex**，目标为聊天与列表**各自内部滚动**、整页不出现纵向条（以实际浏览器为准微调 padding）。
- **文档**：本日收尾同步 **`readme.md`**、**`study-progress.md`**、**`frontend-backend-contract.md` §5**、**`frontend-refactor-plan.md`**、**`react-learning-checklist.mdc`**。

---

## 2026-05-17

- **聊天页结构**：会话相关 UI 收拢至 **`src/pages/chat/`**（**`ChatPage.tsx`** + **`components/ConversationList.tsx`**、**`ChatThreadPanel.tsx`**）；**`/chat`** 为**左右分栏**（列表 | 消息区）。
- **会话 API（续）**：**`src/api/conversations.ts`** 增补 **`getConversationMessages`**、**`createConversation`**；**`src/types/conversations.ts`** 增补消息与新建 body 等类型。
- **交互**：列表单选传递 **`ConversationListItem`** 快照（标题用 **`memory_title`**，空则默认文案）；**`ChatThreadPanel`** 对选中会话 **`useQuery`** 拉消息、**时间正序**展示；**新建会话**（**`useMutation`**）后 **`invalidateQueries`**、跳第一页并选中新建 id。
- **文档**：同步 **`readme.md`**、**`docs/frontend-backend-contract.md`** §5、**`docs/frontend-refactor-plan.md`**、**`docs/study-progress.md`**、**`.cursor/rules/react-learning-checklist.mdc`**；**下一步**文档口径统一为 **接入 `POST /chat/stream`（SSE）**。

---

## 2026-05-16

- **路由**：引入 **`react-router-dom`**；**`main.tsx`** 包裹 **`BrowserRouter`**；**`App.tsx`** 使用 **`Routes` / `Route`**，页面 **`src/pages/HomePage`**（`/`）、**`ChatPage`**（`/chat`）、**`NotFoundPage`**（`*`）；顶栏 **`Link`** 导航。
- **会话类型与 API**：**`src/types/common.ts`**（**`ApiResponse`、`ListResult`、`ListQuery`** 等）、**`src/types/conversations.ts`**；**`src/api/conversations.ts`** 封装 **`GET conversation/list`**、**`POST conversation/delete`**（JSON body **`{ ids: number[] }`**）。
- **会话列表 UI**：**`src/components/ConversationList.tsx`** — **`useQuery`** 分页列表；单选当前会话 id；多选、全选本页、单条删除与批量删除（**`useMutation`** + **`invalidateQueries`**）；翻页时清空多选。
- **文档**：同步 **`readme.md`**、**`docs/frontend-backend-contract.md`**、**`docs/study-progress.md`**、**`docs/frontend-refactor-plan.md`** 执行记录与本节。

---

## 2026-05-15

- **R2 骨架落地**：新 **`src/`** 含 **`utils/request.ts`**、**`config/env.ts`**、**`types/common.ts`**、**`main.tsx` / `App.tsx`**、**`styles/`**、**`vite-env.d.ts`**；**`index.html`** 指向 **`/src/main.tsx`**。**当前无**对已下线路由（`/tasks`、`/agent/*` 等）的封装。
- **文档同步**：**`readme.md`** §1～§3、§5；**`docs/frontend-backend-contract.md`** §3～§5；**`docs/frontend-refactor-plan.md`** 勾选 **R1/R2** 并记执行记录。

---

## 2026-05-14

- **前端重构计划**：新增 **`docs/frontend-refactor-plan.md`**，作为与 **`myproject/backend`** 对齐的**重新开始**的执行清单（布局、API、组件、清理、验收）；**`readme.md`** 文首、**`documentation-index.md`**、**`study-progress.md`** 已指向该文件。
- **文档体系**：新增 **`docs/documentation-index.md`**（文档索引）、**`docs/study-progress.md`**（学习进度与文档提交约定）、**`docs/frontend-backend-contract.md`**（前后端契约）、**`docs/product-roadmap.md`**（产品构想）。根目录 **`readme.md`** 改为与 **`myproject/backend/readme.md`** 类似的分工：只保留定位、架构摘要、功能实现表、环境与极简 API 备忘，其余拆至 `docs/`。
- **协作规则**：新增 **`docs/collaboration-and-coding-rules.md`**；**`frontend-project-goal.mdc`** 与 **`myproject/backend/.cursor/rules/python-learning-agent.mdc`** 对齐——允许直接维护 **`readme.md`** / **`docs/*.md`** / **`.cursor/rules/`**；**`src/**`** 与 **`index.html`** 仅当用户正文含**一字不差**的 **`本次允许修改`** 六字时方可工具修改；**`package.json`**、**`vite.config.*`** 等配置类文件不得工具修改（仅口述）。
- **契约对齐**：现行联调以 **`myproject/backend`** 已挂载路由为准（`/health`、`/chat/stream`、`/conversation/*`）；旧 `/tasks`、`/agent/*`、非流式 `/chat`、`/events` 等在前端代码中仍为**遗留**，待重构移除或替换。
- **重构 §1（2026-05-14）**：完成 **`frontend-refactor-plan.md`** 之 **1.2** 复核；**`frontend-backend-contract.md`** §5 补充 **`done`/`onDone`** 与后端契约差异；**1.1** 待后端启动后本地确认 **`HealthHeader`**。
- **重构策略（2026-05-14）**：改为**移除整个 `src/` 后完全重写**；**`frontend-refactor-plan.md`** 改为以 **§R** 为主路径；**`readme.md`**、**`study-progress.md`**、**`frontend-backend-contract.md`** §5 已标注策略与历史快照说明。
