# React 前端 — Agent 项目

> **换设备 / 新对话**：根目录 **`readme.md`** + **`docs/documentation-index.md`** + **`docs/study-progress.md`**（**下一步从哪接**）+ **`.cursor/rules/study-project-goal.mdc`** + **`study-plan.mdc`** + **`study-rewrite-pedagogy.mdc`** + **`study-learning-checklist.mdc`**。  
> **变更流水**：**`docs/changelog.md`**。  
> **前后端契约**：**`docs/frontend-backend-contract.md`**。  
> **完整重写清单 §W**：**`docs/frontend-refactor-plan.md`**。  
> **产品构想**：**`docs/product-roadmap.md`**。  
> **协作摘要**：**`docs/collaboration-and-coding-rules.md`**。  
> **Ant Design 弃用/易混**：**`docs/antd-api-notes.md`**。  
> **后端权威**：**`myproject/backend/docs/chat-stream-api.md`**、**`conversations-api.md`**、**`artifacts-api.md`**、**`agent-presets.md`**（含 **`GET /dict/{dict_key}`**）。

**路径说明（规范）**：**`myproject/frontend`**（本仓库）、**`myproject/backend`**；**不在文档中记录本机克隆目录**。

---

## 1. 项目是做什么的

- **定位**：**`myproject/backend`**（Python + FastAPI）的 **Web 界面**；**React + TypeScript + Vite**，**Ant Design**，**TanStack React Query**。
- **当前阶段（2026-07-24）**：**完整重写**（§**W**）。**W0～W7 ✅**；**W8′ ✅**。backend **R4b.2 解析已接入**（前端发 `attachment_ids` 即可；气泡仍只显示用户原话）。  
- **下一步**：backend **失败可见 / Abort** 后再改停止 UI；有 zhipu 时可验附件问答。详见 **`docs/study-progress.md`**。  
- **非目标（近期）**：用户画像设置页；composer 暴露 `chat`/`mcp`；恢复 **`schedule` / schedule_draft / 旧 A1③`**。

---

## 2. 目录与架构（摘要）

> **当前磁盘真相**（随提交更新）。旧实现对照：**`backup/src/`**（勿当运行入口）。

```
.
├── backup/src/              # 重写前快照（只读对照）
├── docs/
├── src/                     # ← 运行入口
│   ├── main.tsx             # Router + Query + antd zhCN
│   ├── App.tsx              # 顶栏 + Routes + HealthBage
│   ├── components/HealthBage.tsx
│   ├── api/
│   │   ├── health.ts
│   │   ├── conversations.ts # list/create/delete/messages
│   │   ├── chatStream.ts    # SSE；UI 日常显式 routing=auto
│   │   ├── artifacts.ts     # upload + download
│   │   └── dict.ts          # GET /dict/{dict_key}
│   ├── config/env.ts
│   ├── constants/routes.ts
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── NotFoundPage.tsx
│   │   └── chat/
│   │       ├── index.tsx / index.scss
│   │       ├── ConversationList/   # 列表 + antd Button/Modal/Empty/Alert
│   │       └── ChatThreadPanel/    # 消息 + SSE + 附件 + 身份 + Collapse
│   ├── styles/
│   ├── types/
│   │   ├── common.ts
│   │   ├── conversations.ts
│   │   ├── chatStream.ts    # preset?: string
│   │   ├── artifacts.ts
│   │   └── dict.ts          # DictItem / DictListData
│   └── utils/
│       ├── url.ts
│       └── request.ts
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
| SSE 类型 + api | `types/chatStream`、`api/chatStream` | ✅ W2 | `preset?: string`；api 层省略 routing 时仍默认 `chat` |
| 附件 types + api | `types/artifacts`、`api/artifacts` | ✅ W2 | upload / download |
| 通用字典 | `types/dict`、`api/dict` | ✅ | `getDict`；身份用 `"presets"` |
| 聊天双栏布局 | `pages/chat` | ✅ W3～W4 | |
| 会话列表 UI | `ConversationList` | ✅ W5 + antd | Button / Modal.confirm / Empty / Alert |
| 线程 + SSE UI | `ChatThreadPanel` | ✅ W6 + W8′ | 固定 `auto`；身份 Radio；Collapse 工具区；Enter 发送 / Shift+Enter 换行 |
| 附件 UI | composer + 气泡 | ✅ W7 | 上传 / 粘贴 / 预览 / `attachment_ids` / 下载 |
| 旧业务对照 | `backup/src/` | 🗄 | 不迁回 |

---

## 4. 环境与启动

- **安装**：`npm install`
- **开发**：`npm run dev`（默认 **`http://localhost:5173`**）
- **API 基址**：`.env.development` 中 **`VITE_API_BASE_URL`**（指向 backend 根 URL）

---

## 5. API 约定备忘

- JSON：**`{ code, data, msg }`**；SSE / 附件 / 字典见 **`docs/frontend-backend-contract.md`** 与 backend 文档。
- **日常发送**：**显式** **`routing=auto`**（勿省略；后端省略默认是 `chat`）；身份选项来自 **`GET /dict/presets`**；「普通」不传 `preset`，导游等传 `records[].value`。
- **勿再调用**：**`GET /agent/presets`**（已废）。
- **消息列表**：接口 **`created_at` 降序**；前端按 **`id` 升序**再渲染。
- **纯附件**：可只发 `attachment_ids`；解析完成前 backend 可固定「尚未解析」说明（见 backend **`chat-stream-api.md`** / R4b.2）。
- **快捷键**：Enter 发送；Shift+Enter 换行（`onKeyDown`，忽略 IME `isComposing`）。
