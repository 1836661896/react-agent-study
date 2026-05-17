# React 前端 — Agent 项目

> **换设备 / 新对话**：根目录 **`readme.md`** + **`docs/documentation-index.md`**（各文档职责）+ **`.cursor/rules/frontend-project-goal.mdc`** + **`frontend-study-plan.mdc`** + **`react-learning-checklist.mdc`**。  
> **变更流水**：**`docs/changelog.md`**。  
> **学习进度与下一步**：**`docs/study-progress.md`**。  
> **前后端契约（接口、信封、SSE、遗留差距）**：**`docs/frontend-backend-contract.md`**。  
> **前端重构执行计划（分步清单）**：**`docs/frontend-refactor-plan.md`**。  
> **产品构想与排期**：**`docs/product-roadmap.md`**。  
> **协作与编码约定（人类可读摘要）**：**`docs/collaboration-and-coding-rules.md`**（硬约束以 **`.cursor/rules/frontend-project-goal.mdc`** 为准）。  
> **流式 / 会话字段级约定（后端权威）**：**`myproject/backend/docs/chat-stream-api.md`**、**`myproject/backend/docs/conversations-api.md`**。

**路径说明（规范）**：**`myproject/frontend`**（本仓库）、**`myproject/backend`** 为文档中的约定路径；协作时以此为准。**不在项目文档中记录本机实际克隆目录**。

---

## 1. 项目是做什么的

- **定位**：**`myproject/backend`**（Python + FastAPI）的 **Web 界面**；技术栈为 **React + TypeScript + Vite**，UI 库 **Ant Design**，数据请求 **TanStack React Query**（部分模块）。
- **当前阶段**：后端为**会话 + 流式聊天**（含 **`routing=auto`** 与 MCP **`tool_call` / `tool_result`**）；前端 **R1～R4 主路径已落地**：**多页路由**、顶栏 **`GET /health`**（**`HealthBage`**）、**`/chat` 双栏**（列内滚动）：左侧会话列表，右侧消息 **`useInfiniteQuery`** + **SSE**（**`delta` / `error` / `done`** 及工具事件展示）。发送模式 UI 仅 **「自动 / 对话」**；MCP 由 **auto** 或后续「能力按钮」触发，不在模式切换中暴露。**下一步（R5 / 阶段 4）**：**`npm run lint` 纳入提交习惯**（当前已通过）、流式 **Abort**、具名能力按钮、三栏左占位等见 **`docs/frontend-refactor-plan.md`**。

---

## 2. 目录与架构（摘要）

> **说明**：以下为**当前磁盘上 `src/` 真实结构**（随提交更新）；**目标能力**仍以 **`docs/frontend-refactor-plan.md`** §**R3～R4** 为准。

```
.
├── docs/                    # 说明类文档（职责见 documentation-index.md）
├── src/
│   ├── api/
│   │   ├── conversations.ts # list / delete / create / messages
│   │   ├── chatStream.ts    # POST /chat/stream（SSE 行解析）
│   │   └── health.ts        # GET /health
│   ├── components/
│   │   └── HealthBage.tsx   # 顶栏健康状态（useQuery）
│   ├── config/
│   │   └── env.ts           # VITE_API_BASE_URL
│   ├── pages/
│   │   ├── chat/
│   │   │   ├── index.tsx    # 路由 /chat：左右分栏 + 选中会话与缓存同步
│   │   │   ├── index.scss
│   │   │   ├── ConversationList/
│   │   │   │   ├── index.tsx   # 列表、分页（含删空末页夹紧 page）、新建、多选、删
│   │   │   │   └── index.scss
│   │   │   └── ChatThreadPanel/
│   │   │       ├── index.tsx   # 消息 infinite、SSE、自动/对话模式、工具条、乐观气泡
│   │   │       └── index.scss
│   │   ├── HomePage.tsx     # 路由 /
│   │   └── NotFoundPage.tsx # 路由 *
│   ├── types/
│   │   ├── common.ts        # ApiResponse、ListResult、ListQuery 等
│   │   ├── conversations.ts # 会话/消息类型与后端对齐
│   │   └── chatStream.ts    # SSE 事件与请求体类型
│   ├── utils/
│   │   ├── request.ts       # HttpError、request()
│   │   ├── common.ts        # errorDescription 等
│   │   └── datetime.ts      # formatDisplayDateTime（列表与消息时间）
│   ├── styles/
│   │   ├── main.scss        # 全局 reset、#root 高度链
│   │   └── App.scss         # Layout 一屏 flex、主区不溢出
│   ├── App.tsx
│   ├── main.tsx             # BrowserRouter、QueryClientProvider、antd zhCN
│   └── vite-env.d.ts
├── index.html               # /src/main.tsx
├── vite.config.js           # @ → ./src
├── tsconfig.json
└── package.json
```

**架构约定（当前 → 目标）**

- **JSON**：当前由 **`src/utils/request.ts`** 的 **`request()`** 对接 **`{ code, data, msg }`**（与计划中的 **`lib/http.ts`** 角色相同；是否改名为 `lib/http` 由后续重构决定）。
- **路由**：**`react-router-dom`** 的 **`BrowserRouter`** 在 **`main.tsx`**；**`/chat`** 页面在 **`src/pages/chat/index.tsx`**（经 **`App.tsx`** **`import ChatPage from "./pages/chat"`**）。
- **会话 HTTP**：**`src/api/conversations.ts`** 已封装 **`list`**、**`delete`**、**`create`**、**`messages`**（见 **`docs/frontend-backend-contract.md`**）。
- **SSE**：**`src/api/chatStream.ts`**，**`POST /chat/stream`**，与 **`src/types/chatStream.ts`** 对齐后端 **`docs/chat-stream-api.md`**。
- **环境**：**`src/config/env.ts`** → **`VITE_API_BASE_URL`**。

---

## 3. 功能模块与实现程度

> **约定**：与 **`docs/frontend-refactor-plan.md`** §**R** 同步；细项随代码更新。

| 模块 | 主要路径 | 实现程度 | 说明 |
|------|-----------|-----------|------|
| 应用入口与全局壳 | `main.tsx`、`App.tsx` | 已完成（R4） | **`BrowserRouter`** + React Query + antd 中文；顶栏 **`Link`** + **`HealthBage`**；**`Routes`**（`/`、`/chat`、`*`） |
| 环境变量 | `config/env.ts` | 已完成（R2） | 缺少 `VITE_API_BASE_URL` 时抛错 |
| JSON 请求封装 | `utils/request.ts` | 已完成（R2） | `HttpError`、`request`；注意 **`exactOptionalPropertyTypes`** 下 **`fetch` init** 勿显式传 `body: undefined` |
| 类型（信封与会话 / 流式） | `types/common.ts`、`types/conversations.ts`、`types/chatStream.ts` | 已完成（R3） | **`ApiResponse`、`ListResult`**；SSE 含 **`tool_call` / `tool_result`**；请求体 **`mcp_tool?`** 供后续能力按钮 |
| 会话 API | `api/conversations.ts`、`api/chatStream.ts`、`api/health.ts` | 已完成（R3/R4） | JSON：**list / delete / create / messages / health**；SSE：**postChatStream** + 工具回调 |
| 聊天页 UI | `pages/chat/index.tsx`、`ConversationList/*`、`ChatThreadPanel/*` | 进行中 | **一屏双栏**；列表分页/新建/删除；右侧 infinite 消息、**自动/对话** Segmented、**toolTrace** 工具条、乐观气泡 |
| 健康检查 UI | `api/health.ts`、`components/HealthBage.tsx` | 已完成（R4） | 顶栏 Tag，30s **`refetchInterval`** |
| 流式发送 | `api/chatStream.ts`、`ChatThreadPanel` | 进行中 | **`delta`/`error`/`done`** + **`tool_*`** 展示；**`invalidateQueries`**；待 **Abort**、具名能力按钮（阶段 4） |
| 已下线路由封装 | — | **无** | 当前 `src` 无 **`/tasks`、`/agent/*`、`/events`** 等封装（与 **`frontend-backend-contract.md`** §3 一致） |

---

## 4. 环境与启动

- **Node.js**：与 **`package.json`** 中 Vite / TypeScript 版本兼容的当前 LTS 即可。
- **安装依赖**：在项目根目录执行 `npm install`。
- **本地开发**：`npm run dev`（Vite 默认 **`http://localhost:5173`**）。
- **API 基址**：配置 **`.env.development`** / **`.env.production`** 中的 **`VITE_API_BASE_URL`**（指向 **`myproject/backend`** 服务根 URL，无尾斜杠亦可，由 **`utils/request.ts`** 等拼接路径）。

---

## 5. API 约定备忘

- **JSON**：**`{ code, data, msg }`**；**`code !== 0`** 业务失败（实现位置：**`src/utils/request.ts`** 的 **`request()`**）。
- **SSE**：**`/chat/stream`**；事件形态与 **`ChatRequest`** 字段见 **`myproject/backend/docs/chat-stream-api.md`**。
- **会话分页**：见 **`myproject/backend/docs/conversations-api.md`**。
- **完整接口表与遗留说明**：**`docs/frontend-backend-contract.md`**。

---

## 6. 后端仓库

- **`myproject/backend`**：根 **`readme.md`** 为后端当前真相；与本前端联调时以前端 **`docs/frontend-backend-contract.md`** 自查是否仍调用已下线路由。
