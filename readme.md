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
- **当前阶段**：后端已重构为**会话 + 流式聊天**；前端计划为**移除现有 `src/` 目录后从零重写**（不保留当前组件实现），执行清单见 **`docs/frontend-refactor-plan.md`** §**R**；旧界面仅以 git 历史可查。

---

## 2. 目录与架构（摘要）

> **说明**：计划**删除现有 `src/` 后按 **`docs/frontend-refactor-plan.md`** §**R** 重建**。下表为**目标结构**（与现行磁盘可能不一致，直至 **R5** 完成）。

```
.
├── docs/                    # 说明类文档
├── src/
│   ├── api/                 # conversation、chatStream、common(health) 等
│   ├── components/          # 布局与业务区块（左占位、会话列表、聊天等）
│   ├── config/              # env（VITE_API_BASE_URL）
│   ├── lib/                 # http、错误类型
│   ├── types/               # 与后端契约对齐的类型
│   ├── App.tsx              # 三栏主布局
│   └── main.tsx             # 入口；React Query Provider 等
├── index.html               # 入口 script 须指向实际 main（如 /src/main.tsx）
├── vite.config.js
└── package.json
```

**架构约定（目标）**

- **JSON**：**`src/lib/http.ts`** + **`{ code, data, msg }`**。
- **SSE**：**`src/api/chatStream.ts`**，`fetch` + ReadableStream；**`done`** 含 **`conversation_id` / `turn_id`**。
- **环境**：**`src/config/env.ts`** → **`VITE_API_BASE_URL`**。

---

## 3. 功能模块与实现程度

> **约定**：整 **`src/`** 重写完成前，不逐文件维护旧表；以 **`docs/frontend-refactor-plan.md`** §**R** 勾选为准。完成后在此恢复「模块 ↔ 路径 ↔ 实现程度」细表。

| 模块 | 主要路径 | 实现程度 | 说明 |
|------|-----------|-----------|------|
| 全栈前端（相对后端契约） | `src/`（待建） | **待重写** | 执行 **`frontend-refactor-plan.md`** **R0～R5**；旧 `src` 不保留 |

---

## 4. 环境与启动

- **Node.js**：与 **`package.json`** 中 Vite / TypeScript 版本兼容的当前 LTS 即可。
- **安装依赖**：在项目根目录执行 `npm install`。
- **本地开发**：`npm run dev`（Vite 默认 **`http://localhost:5173`**）。
- **API 基址**：配置 **`.env.development`** / **`.env.production`** 中的 **`VITE_API_BASE_URL`**（指向 **`myproject/backend`** 服务根 URL，无尾斜杠亦可，由 `http.ts`/`chatStream` 拼接路径）。

---

## 5. API 约定备忘

- **JSON**：**`{ code, data, msg }`**；**`code !== 0`** 业务失败（实现位置：**`src/lib/http.ts`**，待 **R3** 落地）。
- **SSE**：**`/chat/stream`**；事件形态与 **`ChatRequest`** 字段见 **`myproject/backend/docs/chat-stream-api.md`**。
- **会话分页**：见 **`myproject/backend/docs/conversations-api.md`**。
- **完整接口表与遗留说明**：**`docs/frontend-backend-contract.md`**。

---

## 6. 后端仓库

- **`myproject/backend`**：根 **`readme.md`** 为后端当前真相；与本前端联调时以前端 **`docs/frontend-backend-contract.md`** 自查是否仍调用已下线路由。
