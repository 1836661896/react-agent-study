# 变更流水（文档与工程）

> 偏「历史追溯」；**当前功能与架构**以根目录 **`readme.md`** 为准。

---

## 2026-07-23（提交 · W8′ 完整收尾）

- **产品**：日常 **`routing=auto`**；身份拉 **`GET /dict/presets`**（废 `/agent/presets`）；「普通」不传 `preset`。  
- **UI**：antd 列表/状态/Collapse；Enter 发送、Shift+Enter 换行。  
- **新增**：`types/dict.ts`、`api/dict.ts`、`docs/antd-api-notes.md`。  
- **文档**：readme / study-progress / refactor-plan / 契约 / changelog 对齐。  
- **下一步**：**R4b.2** 附件解析联调。

---

## 2026-07-23（前端 · 接 GET /dict/presets）

- **代码（用户自改）**：`types/dict.ts`、`api/dict.ts`；`ChatThreadPanel` 拉 presets + Radio；`preset?: string`。  
- **下一步**：**R4b.2** 附件解析联调（解析主要在 mcp-server；前端先确认契约再改）。

---

## 2026-07-23（契约修正 · 通用字典 /dict）

- **backend**：废弃 **`GET /agent/presets`**；改为 **`GET /dict/{dict_key}`**；身份列表 **`GET /dict/presets`**（响应仍 `records[{ label, value }]`）。权威：**`python-agent-learning/docs/agent-presets.md`**。  
- **前端计划**：通用 dict types/api，勿再封装 `/agent/presets`。若已写 `types/agentPresets.ts`，改为 **`types/dict.ts`**。  
- **下一步**：改 types → `api/dict.ts` → Radio 拉表。

---

## 2026-07-23（契约 · GET /agent/presets）

- **实测（已废）**：曾用 `/agent/presets`；**请改测 `/dict/presets`**。  
- **文档**：以本节上方「通用字典」为准。

---

## 2026-07-23（W8′ 展示 · antd 替换收尾）

- **代码（用户自改）**：`ConversationList` / `ChatThreadPanel` 原生按钮与状态文案 → antd；工具区 → `Collapse`；抽屉旧 SCSS 清理。  
- **备忘**：`Alert.title`、`Spin.description`（见 **`antd-api-notes.md`**）。  
- **验收**：用户晚间再做；编码下一站仍为 **身份 catalog**（R4b.2 前）。

---

## 2026-07-23（文档 · antd 弃用备忘）

- **新增**：**`docs/antd-api-notes.md`** — 本仓库 Ant Design 弃用/易混 API 对照表。  
  - `Alert.message` → `title`  
  - `Spin.tip` → `description`（antd 6.3+）  
- **索引**：`documentation-index.md` 增第 8 条。

---

## 2026-07-23（W8′ 主路径 · 进入 catalog）

- **代码（用户自改）**：`ChatThreadPanel` — 固定 `routing: "auto"`；身份 Radio；`identity !== "normal"` → `preset`。  
- **下一步**：**身份 catalog 接口**（R4b.2 之前）；先契约对齐，再 types/api/UI。

---

## 2026-07-23（产品 · 仅身份手动切换）

- **口径**：前端日常固定 **`routing: "auto"`**，去掉 chat/auto 切换；用户可见唯一模式开关为 **身份**（普通 / 导游 `preset=guide`）。  
- **排期补记**：**身份列表 / catalog 接口**（可用身份 label + `preset` 关键字）放在 **开始 R4b.2 附件解析 / 调 MCP 之前**；到位后再动解析联调。  
- **文档**：readme / study-progress / refactor-plan W8′ / product-roadmap / 契约 §5。  
- **代码**：W8′ 用户自改 `ChatThreadPanel`（未代改 `src`）。

---

## 2026-07-22（排期 · 语音前顺序定稿）

- **下一程**：① 展示优化 + 身份切换 → ② R4b.2 解析联调 → ③ Abort → ④ **`routing=plan`** → ⑤ 语音。  
- **不做优先**：用户画像设置页。  
- **文档**：study-progress / readme / refactor-plan 与 backend 对齐。

---

## 2026-07-22（联调对齐 · preset / 消息顺序）

- **代码**：去掉发送体硬编码 **`preset: "guide"`**（日常无身份）；历史 **`records` 按 `id` 升序**展示。
- **对齐 backend**：纯附件可只发 **`attachment_ids`**（backend 固定回复）；`message` / 附件二选一。
- **文档**：readme §1/§3/§5、契约 §2/§5、refactor-plan 验收、study-progress。
- **下一会话**：**主路径验收**或 **W8**；R4b.2 解析更后。

---

## 2026-07-22（W7 打磨 · 附件体验 + SCSS）

- **代码**：粘贴任意文件；待发/历史图预览与非图文件名；发送 revoke；切换会话 `useEffect` 清理；`tool_result` `is-error`；`PostChatStreamBody` 条件赋值；`index.scss` 按页面顺序重排 + BEM。
- **约定（暂）**：不处理「文字+文件」同贴；大小上限前端仍 `10MB`（未改）。
- **文档**：study-progress / refactor-plan / readme / 契约 §5 / checklist 同步。
- **下一会话**：验收或 **W8**。

---

## 2026-07-22（W7 附件 ①～④）

- **代码**：composer antd 化；`uploadArtifact` + pending；粘贴；发送 `attachment_ids`；历史附件 + `downloadArtifact`。
- **文档**：readme / study-progress / refactor-plan / 契约 §5 / checklist / plan；**W7 ✅**。
- **下一会话**：打磨见上条；或 **W8**。

---

## 2026-07-22（W6 tool 抽屉 ③④ 收尾）

- **代码**：`ChatThreadPanel` 接 `onToolCall` / `onToolResult`；`toolItems` + `toolsOpen`；antd `Button` 开合；稳定 `id` 作列表 `key`。
- **文档**：readme / study-progress / refactor-plan / checklist / plan 同步；**W6 ✅**。
- **下一会话**：**W7** 附件 UI（①～④；优先 antd）。

---

## 2026-07-21（W6 tool 抽屉 ①②）

- **代码**：`ChatThreadPanel` 工具抽屉 DOM 占位 + `pages/chat/index.scss` 展开/收起样式（写死示例；未接 SSE）。
- **UX 约定**：持久抽屉——来 `tool_*` 默认开、流结束默认关、可手动再开。
- **未做**：handlers 壳与真实 state。
- **文档**：readme / study-progress / refactor-plan / 契约 §5 / checklist / plan 同步。
- **下一会话**：W6 ③→④ → W7 附件 UI。

---

## 2026-07-21（W2～W6 主路径 · 下班提交）

- **W2**：**`api/chatStream.ts`**（默认 **`chat`**）；**`types/artifacts`** + **`api/artifacts`**。
- **W3～W4**：`/chat` 双栏 DOM + CSS（一屏高度 / 分区滚动）。
- **W5**：**`ConversationList`** — list / create / delete；选中抬到父 state。
- **W6 半**：**`ChatThreadPanel`** — messages；SSE（**`guide`**）；乐观气泡；**`routing` chat|auto**。未做 **`tool_*` UI**。
- **文档**：readme / study-progress / refactor-plan / 契约 §5 / checklist / plan 同步至当前进度。
- **下一会话**：W6 `tool_*` → W7 附件 UI。

---

## 2026-07-21（W2 收尾 · 午前）

- **代码**：**`api/chatStream.ts`**（默认 **`routing=chat`**）；**`types/artifacts`** + **`api/artifacts`**（upload / download）。
- **文档**：当时同步至 W2；当日晚已推进到 W6（见上条）。

---

## 2026-07-20（W1 收尾 + W2 半截 · 下班提交）

- **W1**：`request.ts`、`api/health`、`HealthBage` 挂顶栏。
- **W2 半**：`ListQuery`/`ListResult`；`types/conversations` + `api/conversations`；`types/chatStream`（SSE 字段对齐后端；默认身份 **`guide`**）。
- **未做（下次）**：**`api/chatStream.ts`**、artifacts types/api。
- **教学**：UI 严格 DOM→CSS→引用→逻辑；Health 过简曾整段给代码为例外。
- **文档**：readme / study-progress / refactor-plan §W2 / 契约 §5 / checklist / plan 同步。

---

## 2026-07-20（W1 收尾 · request + Health）

- **代码**：**`utils/request.ts`**、**`api/health.ts`**、**`components/HealthBage`** 挂顶栏；W1 勾选完成。
- **教学**：Health 过简曾整段给代码；用户确认 **后续 UI 严格 DOM → CSS → 引用 → 逻辑**。
- **文档**：**`readme`**、**`study-progress`**、**`frontend-refactor-plan` §W1**、契约 §5、checklist / pedagogy / plan 同步。
- **下一会话**：**W2** 类型与 API。

---

## 2026-07-20 晚（路径大小写约定）

- **本仓库**：`git config --local core.ignorecase false`（需各机自配；见协作文档）。
- **编辑器**：**`.vscode/settings.json`** 增加 **`files.useCaseSensitiveFileNames: on`**。
- **文档**：**`collaboration-and-coding-rules.md`** 补充 Windows 大小写约定；建议本地开启 TS **`forceConsistentCasingInFileNames`**。

---

## 2026-07-20 晚（W0 迁移 + W1 空壳进行中 · 下班提交）

- **W0**：旧业务 **`src/`** 整树迁入 **`backup/src/`**（提交入库便于换设备对照）。
- **W1 已落地**：新 `src` 空壳 — `main`（Router + Query + antd 中文）、顶栏与 `/` `/chat` `*` 占位、全局/App SCSS、`env` / `ApiResponse` / `buildApiUrl`。
- **W1 未完**：尚无 **`request.ts`**、无 Health 顶栏；下一会话从补全请求层 + Health 继续。
- **文档/规则**：同步 **`readme`**、**`study-progress`**、**`frontend-refactor-plan` §W1**、**契约 §5**、**`study-rewrite-pedagogy`**（含确认约定 **`1`**）。

---

## 2026-07-20（选定完整重写 + 教学规则）

- **决策**：对齐重建 **`myproject/backend`**，**删除整目录 `src/` 后重写**（§**W**）。
- **新增规则**：**`.cursor/rules/study-rewrite-pedagogy.mdc`** — ①DOM → ②CSS → ③引用 → ④逻辑；禁止一次给整页完整代码。
- **更新**：**`study-plan.mdc`**、**`study-learning-checklist.mdc`**、**`study-project-goal.mdc`**（重建 API：`guide`、附件、画像）；**`frontend-refactor-plan.md`**（§R→§W）；**`frontend-backend-contract.md`**；**`readme.md`**；**`study-progress.md`**；**`documentation-index.md`**；**`collaboration-and-coding-rules.md`**。
- **契约要点**：身份 **`preset=guide`**；默认 **`routing=chat`**；**`POST /artifact`** + **`attachment_ids`**；messages **`attachments`**；旧 **`schedule` / A1③** 非主路径。

---

## 2026-06-29（文档与代码对齐 · A1 ② artifact）

- **代码现状（此前已落地，文档滞后）**：**`utils/artifactParse.ts`**、**`api/artifacts.ts`**、**`useChatThreadPanel`** 解析 **`artifactId`**、**`ChatThreadPanel`** toolTrace **「下载文件」** 按钮。
- **文档**：**`readme.md`**、**`frontend-backend-contract.md` §5**、**`study-progress.md`**、**`study-plan.mdc`**、**`study-learning-checklist.mdc`**、**`frontend-refactor-plan.md`** 执行记录同步；A1 ② 标为 **已实现，待 §6 四轮验收**。
- **仍待做**：A1 ③ composer 快捷导出；流式 Abort UI；**`trip-assistant.md` §6** 联调验收。

---

## 2026-06-29（按 coding-architecture 规则调整 src）

- **新增** **`src/constants/queryKeys.ts`**、**`routes.ts`**；**`src/utils/url.ts`**（`buildApiUrl` 供 request / chatStream / artifacts 共用）。
- **拆分** **`ChatThreadPanel/useChatThreadPanel.ts`**（524→~320 行 UI + hook）；**`pages/chat/conversationListCache.ts`**。
- **统一** `@/` 跨目录 import、**`queryKeys`** 引用、**`ROUTES`** 路由常量；**`App.tsx`** / **`NotFoundPage`** 改用常量。

---

## 2026-06-29（规则文件命名统一）

- **重命名** **`.cursor/rules/`**：教学规则 → **`study-project-goal.mdc`**、**`study-plan.mdc`**、**`study-learning-checklist.mdc`**；编码规则 → **`coding-architecture.mdc`** 等 10 个 **`coding-*`** 文件（去掉 youbomao 断号编号）。
- **文档**：**`collaboration-and-coding-rules.md`**、**`documentation-index.md`**、**`readme.md`**、**`study-progress.md`**、**`frontend-refactor-plan.md`** 交叉引用同步。

---

## 2026-06-29（同步 youbomao_PC 架构/编码 rules）

- **新增** **`.cursor/rules/`**：**`00-architecture.mdc`**、**`02-imports.mdc`**、**`03-comments.mdc`**、**`04-api-request.mdc`**（fetch + SSE）、**`06-react-components.mdc`**、**`07-styling.mdc`**、**`08-eslint-quality.mdc`**（ESLint + Biome）、**`09-documentation.mdc`**、**`12-pragmatic-structure.mdc`**、**`13-data-investigation.mdc`**。
- **未同步**：youbomao 三端专用规则（**`01-architecture`**、**`10-agent-portal`**、**`11-portal-sharing`**、**`05-state-auth`** 待有登录/Zustand 再议）。
- **文档**：**`collaboration-and-coding-rules.md` §4**、**`documentation-index.md`**、**`frontend-project-goal.mdc`** 文首索引更新。

---

## 2026-06-26（backend A1 行程助手 · preset 链路）

- **类型**：**`types/chatStream.ts`** — **`AgentPreset`**、**`PostChatStreamBody.preset?`**。
- **请求层**：**`api/chatStream.ts`** — 有 **`preset`** 时写入 **`POST /chat/stream`** JSON body。
- **聊天区**：**`ChatThreadPanel`** — **`preset`** prop；**`handleSend`** 条件传入 **`postChatStream`**。
- **页面状态**：**`pages/chat/index.tsx`** — **`presetByConvId`**（**`useState<Record<number, AgentPreset>>`**）；**`activePreset`** 传给右侧。
- **列表入口**：**`ConversationList`** — **「行程助手」** 按钮；**`onScheduleSessionCreated`** 回调（状态提升）；普通 **「新建会话」** 不带 preset。
- **联调**：DevTools 验证 **行程助手** 会话 Payload 含 **`"preset":"schedule"`**；普通会话不含。
- **文档**：**`readme.md`**、**`study-progress.md`**、**`frontend-backend-contract.md` §5**、规则 **`.cursor/rules/*`** 同步。
- **未完成（当时口径）**：composer 快捷 **导出 docx/pdf**；backend **`trip-assistant.md` §6** 四轮验收。（**A1 ②** 已于后续代码中落地，见本日「文档与代码对齐」条目。）

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
