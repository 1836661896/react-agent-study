# 学习进度与文档提交约定

> **学习节奏与「下一步」**；**不替代**根目录 **`readme.md`** 中的功能模块表。

---

## 最近一次学习（2026-05-17 · 健康检查与 MCP 展示）

- **健康检查**：**`api/health.ts`** + **`components/HealthBage.tsx`**；**`useQuery`** + **`refetchInterval`**；顶栏成功/失败 Tag（对照 Vue 里单独封装的 status 组件）。
- **SSE 工具事件**：**`chatStream.ts`** 解析 **`tool_call` / `tool_result`**；**`ChatThreadPanel`** 用本地 **`toolTrace`** 展示（不落进 React Query 列表，**`done` 后再 invalidate** 拉历史）。
- **产品分层**：用户模式仅 **自动 / 对话**；MCP 作为 **auto 路由或未来能力按钮** 的实现细节，不在 Segmented 里选「MCP + 工具名」。
- **类型**：**`PostChatStreamBody`** 的 **`mcp_tool?`** 为后续「整理/下载」等按钮预留；日常发送只传 **`routing: auto | chat`**。
- **下一步**：阶段 4 — **能力按钮配置表**、流式 **Abort**；可选三栏左占位；提交前习惯 **`npm run lint`**。

---

## 最近一次学习（2026-05-15）

- **聊天模块目录**：**`/chat`** 入口 **`pages/chat/index.tsx`**；**`ConversationList/`**、**`ChatThreadPanel/`**；一屏布局 **`App.scss` / `main.scss`**。
- **SSE 基础**：**`delta` / `error` / `done`** + **`invalidateQueries`**；乐观气泡与贴底滚动。
- **消息 infinite**、列表 **page 夹紧**、**`queryCache` 同步选中行标题**、**`datetime.ts`**。

---

## 最近一次学习（2026-05-16）

- **路由与会话列表**：**`react-router-dom`**；**`conversations` API** list/delete；**`ConversationList`** 分页与多选删除。

---

## 下一次学习的起点

1. **阶段 4**：composer 下 **具名能力按钮**（映射 **`mcp_tool`** 或增强 **`message`**）；SSE 富展示（代码块等，以后端为准）。
2. **可选**：**AbortController**「停止生成」；三栏左占位。
3. **提交**：源码与文档可同 commit 或分 commit；提交前 **`npm run lint`**。

---

## 提交前约定（文档 + 代码）

### 建议纳入本次提交的文件

**源码（示例，以 `git status` 为准）**

- `src/api/health.ts`、`src/api/chatStream.ts`
- `src/components/HealthBage.tsx`
- `src/App.tsx`、`src/styles/App.scss`
- `src/types/chatStream.ts`
- `src/pages/chat/ChatThreadPanel/*`

**文档**

- `readme.md`
- `docs/changelog.md`、`docs/study-progress.md`、`docs/frontend-backend-contract.md`、`docs/frontend-refactor-plan.md`、`docs/product-roadmap.md`、`docs/documentation-index.md`
- `.cursor/rules/frontend-study-plan.mdc`、`frontend-project-goal.mdc`、`react-learning-checklist.mdc`

### 每次提交前

1. **`npm run lint`**
2. 后端可联调时：顶栏 health 绿、**自动** 模式可触发工具条（需 mcp-server）、**对话** 模式纯 chat
3. 更新 **`readme.md`** 功能表与 **`changelog.md`**

---

## 教学风格（摘要）

- 默认不工具改 **`src/**`**，除非同条消息含 **`本次允许修改`**（见 **`frontend-project-goal.mdc`**）。
