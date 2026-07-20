# React 前端 — Agent 项目

> **换设备 / 新对话**：根目录 **`readme.md`** + **`docs/documentation-index.md`** + **`docs/study-progress.md`**（**下一步从哪接**）+ **`.cursor/rules/study-project-goal.mdc`** + **`study-plan.mdc`** + **`study-rewrite-pedagogy.mdc`** + **`study-learning-checklist.mdc`**。  
> **变更流水**：**`docs/changelog.md`**。  
> **前后端契约**：**`docs/frontend-backend-contract.md`**。  
> **完整重写清单 §W**：**`docs/frontend-refactor-plan.md`**。  
> **产品构想**：**`docs/product-roadmap.md`**。  
> **协作摘要**：**`docs/collaboration-and-coding-rules.md`**。  
> **后端权威**：**`myproject/backend/docs/chat-stream-api.md`**、**`conversations-api.md`**、**`artifacts-api.md`**、**`agent-presets.md`**。

**路径说明（规范）**：**`myproject/frontend`**（本仓库）、**`myproject/backend`**；**不在文档中记录本机克隆目录**。

---

## 1. 项目是做什么的

- **定位**：**`myproject/backend`**（Python + FastAPI）的 **Web 界面**；**React + TypeScript + Vite**，**Ant Design**，**TanStack React Query**。
- **当前阶段（2026-07-20 晚）**：**完整重写进行中**（§**W**）。旧业务在 **`backup/src/`**；新 **`src/`** 为空壳 + 请求地基（未完）。对齐重建后端：**`preset=guide`**、默认 **`routing=chat`**、附件、可选画像。
- **下一步**：补 **`request.ts`** + Health 顶栏（收尾 W1）→ **W2** 类型与 API。详见 **`docs/study-progress.md`**。
- **非目标**：恢复 **`schedule` / schedule_draft / 旧 A1③`**。

---

## 2. 目录与架构（摘要）

> **当前磁盘真相**（随提交更新）。旧实现对照：**`backup/src/`**（勿当运行入口）。

```
.
├── backup/src/              # 重写前快照（只读对照）
├── docs/
├── src/                     # ← 运行入口（重建中）
│   ├── main.tsx             # Router + Query + antd zhCN
│   ├── app.tsx / App.tsx    # 顶栏 + Routes（注意大小写，见 study-progress）
│   ├── config/env.ts        # VITE_API_BASE_URL
│   ├── constants/routes.ts
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── NotFoundPage.tsx
│   │   └── chat/index.tsx   # 占位（W3 双栏）
│   ├── styles/              # main.scss + App.scss（一屏高度）
│   ├── types/common.ts      # ApiResponse 信封
│   └── utils/url.ts         # buildApiUrl
│   # 待补：utils/request.ts、api/*、Health、聊天业务…
├── index.html               # → /src/main.tsx
├── vite.config.js           # @ → ./src
└── package.json
```

---

## 3. 功能模块与实现程度

> 与 **`docs/frontend-refactor-plan.md`** §**W** 同步。

| 模块 | 路径 | 程度 | 说明 |
|------|------|------|------|
| 应用壳 / 路由 / Provider | `main.tsx`、`App`/`app` | 🔄 W1 | 差 Health |
| 环境 / URL | `config/env`、`utils/url` | ✅ | |
| JSON `request` / Health | `utils/request`、`api/health` | ⏳ | 下一会话 |
| 会话 / SSE / 附件 API | `api/*`、`types/*` | ⏳ W2 | `guide`、attachments |
| 聊天双栏 UI | `pages/chat/*` | ⏳ W3～W7 | 现为占位 |
| 旧业务对照 | `backup/src/` | 🗄 | 不迁回 |

---

## 4. 环境与启动

- **安装**：`npm install`
- **开发**：`npm run dev`（默认 **`http://localhost:5173`**）
- **API 基址**：`.env.development` 中 **`VITE_API_BASE_URL`**（指向 backend 根 URL）

---

## 5. API 约定备忘

- JSON：**`{ code, data, msg }`**；SSE / 附件字段见 **`docs/frontend-backend-contract.md`** 与 backend 文档。
- 身份：**`preset=guide`**；日常发送默认 **`routing=chat`**。
