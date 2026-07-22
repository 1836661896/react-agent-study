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
- **当前阶段（2026-07-22）**：**完整重写**（§**W**）。**W0～W7 ✅**；**W8 ⏳**（画像 / Abort）。附件：粘贴文件、图预览、发送挂载已通。
- **下一步**：验收主路径，或 **W8**。详见 **`docs/study-progress.md`**。
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
│   ├── App.tsx              # 顶栏 + Routes + HealthBage
│   ├── components/HealthBage.tsx
│   ├── api/
│   │   ├── health.ts
│   │   ├── conversations.ts # list/create/delete/messages
│   │   ├── chatStream.ts    # SSE；默认 routing=chat
│   │   └── artifacts.ts     # upload + download
│   ├── config/env.ts
│   ├── constants/routes.ts
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── NotFoundPage.tsx
│   │   └── chat/
│   │       ├── index.tsx / index.scss
│   │       ├── ConversationList/   # W5 列表
│   │       └── ChatThreadPanel/    # W6～W7 消息 + SSE + 附件
│   ├── styles/
│   ├── types/
│   │   ├── common.ts
│   │   ├── conversations.ts
│   │   ├── chatStream.ts
│   │   └── artifacts.ts
│   └── utils/
│       ├── url.ts
│       └── request.ts
│   # 待做：W8 可选（画像 / Abort）…
├── index.html
├── vite.config.js
└── package.json
```

---

## 3. 功能模块与实现程度

> 与 **`docs/frontend-refactor-plan.md`** §**W** 同步。

| 模块 | 路径 | 程度 | 说明 |
|------|------|------|------|
| 应用壳 / 路由 / Provider | `main.tsx`、`App` | ✅ W1 | |
| 环境 / URL | `config/env`、`utils/url` | ✅ | |
| JSON `request` / Health | `utils/request`、`api/health`、`HealthBage` | ✅ W1 | |
| 会话 types + api | `types/conversations`、`api/conversations` | ✅ W2 | |
| SSE 类型 + api | `types/chatStream`、`api/chatStream` | ✅ W2 | 默认 `routing=chat`；`guide` |
| 附件 types + api | `types/artifacts`、`api/artifacts` | ✅ W2 | upload / download |
| 聊天双栏布局 | `pages/chat` | ✅ W3～W4 | `index.scss` 按展示顺序分区 |
| 会话列表 UI | `ConversationList` | ✅ W5 | list / create / delete |
| 线程 + SSE UI | `ChatThreadPanel` | ✅ W6 | messages / SSE / `guide` / tool 抽屉 |
| 附件 UI | composer + 气泡 | ✅ W7 | 上传 / 粘贴文件 / 图预览 / `attachment_ids` / 下载 |
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
