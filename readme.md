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
- **当前阶段**：后端为**会话 + 流式聊天**；前端已按 **`docs/frontend-refactor-plan.md`** §**R** 完成 **R1（删旧 `src`）** 与 **R2 最小骨架**（可 `npm run dev`）；**R3～R5**（会话 API、流式、三栏 UI、健康检查联调等）未做。执行清单与勾选见 **`docs/frontend-refactor-plan.md`**。

---

## 2. 目录与架构（摘要）

> **说明**：以下为**当前磁盘上 `src/` 真实结构**（2026-05-15）；**目标能力**仍以 **`docs/frontend-refactor-plan.md`** §**R3～R4** 为准。

```
.
├── docs/                    # 说明类文档（职责见 documentation-index.md）
├── src/
│   ├── config/
│   │   └── env.ts           # VITE_API_BASE_URL
│   ├── types/
│   │   └── common.ts        # ApiResponse 等与 JSON 信封对齐的类型
│   ├── utils/
│   │   └── request.ts       # HttpError、request()：JSON fetch + 业务 code 判断
│   ├── styles/
│   │   ├── main.scss        # 全局 reset
│   │   └── App.scss         # App 布局样式
│   ├── App.tsx              # 当前为 R2 占位页（Ant Design Layout）
│   ├── main.tsx             # 入口；QueryClientProvider、antd ConfigProvider（zhCN）
│   └── vite-env.d.ts        # Vite / import.meta.env 类型
├── index.html               # /src/main.tsx（已与入口一致）
├── vite.config.js           # @ → ./src
├── tsconfig.json
└── package.json
```

**架构约定（当前 → 目标）**

- **JSON**：当前由 **`src/utils/request.ts`** 的 **`request()`** 对接 **`{ code, data, msg }`**（与计划中的 **`lib/http.ts`** 角色相同；是否改名为 `lib/http` 由后续重构决定）。
- **SSE**：**`src/api/chatStream.ts`** 尚未建立（**R3**）。
- **会话 HTTP**：**`src/api/conversation.ts`** 尚未建立（**R3**）。
- **环境**：**`src/config/env.ts`** → **`VITE_API_BASE_URL`**。

---

## 3. 功能模块与实现程度

> **约定**：与 **`docs/frontend-refactor-plan.md`** §**R** 同步；细项随代码更新。

| 模块 | 主要路径 | 实现程度 | 说明 |
|------|-----------|-----------|------|
| 应用入口与全局壳 | `main.tsx`、`App.tsx` | 已完成（R2） | React Query + antd 中文；占位文案指向 R3/R4 |
| 环境变量 | `config/env.ts` | 已完成（R2） | 缺少 `VITE_API_BASE_URL` 时抛错 |
| JSON 请求封装 | `utils/request.ts` | 已完成（R2） | `HttpError`、`request`；注意 **`exactOptionalPropertyTypes`** 下 **`fetch` init** 勿显式传 `body: undefined` |
| 类型（通用信封） | `types/common.ts` | 已完成（R2） | `ApiResponse` |
| 健康检查 UI | — | 未实现 | **R4**：`GET /health` 展示；**§1.1** 依赖后端可连 |
| 会话列表 / 消息 / 流式 | — | 未实现 | **R3～R4** |
| 已下线路由封装 | — | **无** | 当前 `src` 无 **`api/agent|tasks|events`**（与 **`frontend-backend-contract.md`** §3 一致） |

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
