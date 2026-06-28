# 学习进度与文档提交约定

> **学习节奏与「下一步」**；**不替代**根目录 **`readme.md`** 中的功能模块表。

---

## 最近一次学习（2026-06-26 · backend A1 行程助手 · preset）

- **类型与 API**：**`AgentPreset`**、**`PostChatStreamBody.preset`** → **`api/chatStream.ts`** 组 payload（api 层决定最终 JSON，组件只传 body）。
- **Props**：**`ChatThreadPanel`** 接收 **`preset?`**；父 **`ChatPage`** 用 **`activePreset`** 下发（对照 Vue **`:preset`**）。
- **useState + 状态提升**：**`presetByConvId: Record<number, AgentPreset>`** 放在 **`ChatPage`**；**`ConversationList`** 通过 **`onScheduleSessionCreated(id)`** 通知父组件登记 **schedule**（对照 Vue **emit + 父 ref**）。
- **React Query**：**`createMutation.mutate(..., { onSuccess })`** 在单次调用上追加回调，与 **`useMutation` 内 onSuccess** 叠加执行。
- **联调**：Network 确认 **行程助手** 会话 **`preset: "schedule"`**；助手按行程规划师口吻回复。
- **明日起点（第 7 步起）**：见下方 **「下一次学习的起点」**。

---

## 最近一次学习（2026-05-17 · 健康检查与 MCP 展示）

- **健康检查**：**`api/health.ts`** + **`components/HealthBage.tsx`**；**`useQuery`** + **`refetchInterval`**。
- **SSE 工具事件**：**`tool_call` / `tool_result`** + **`toolTrace`**；模式仅 **自动 / 对话**。

---

## 下一次学习的起点

> **目标**：完成 **backend A1** 剩余项，再跑 **`myproject/backend/docs/skills/trip-assistant.md` §6** 四轮对话验收。

1. **第 7 步**：新建 **`src/utils/artifactParse.ts`** — 从 **`tool_result.text`** 解析 **`artifact_id`**（纯函数，非 React）。
2. **第 8 步**：新建 **`src/api/artifacts.ts`** — **`downloadArtifact(id)`**（**`fetch` 二进制**，不走 JSON **`request()`**）。
3. **第 9 步**：**`ChatThreadPanel`** — **`toolTrace`** 展示 **下载** 按钮。
4. **可选第 10 步**：composer 快捷 **导出 docx / pdf**（**`preset=schedule`** 会话可见）。
5. **验收**：backend + mcp-server + PG 已起；同一 **`conversation_id`** 四轮示例；第 4 轮 **`tool_call` → `tool_result` → 可下载 docx**。

---

## 提交前约定（文档 + 代码）

### 建议纳入本次提交的文件

**源码（2026-06-26 批次，以 `git status` 为准）**

- `src/types/chatStream.ts`
- `src/api/chatStream.ts`
- `src/pages/chat/index.tsx`
- `src/pages/chat/ConversationList/index.tsx`
- `src/pages/chat/ChatThreadPanel/index.tsx`

**文档**

- `readme.md`
- `docs/changelog.md`、`docs/study-progress.md`、`docs/frontend-backend-contract.md`
- `.cursor/rules/frontend-study-plan.mdc`、`react-learning-checklist.mdc`

### 每次提交前

1. **`npm run lint`**
2. 后端可联调时：**行程助手** 带 preset；普通会话不带
3. 更新 **`readme.md`** 功能表与 **`changelog.md`**

---

## 教学风格（摘要）

- 默认不工具改 **`src/**`**，除非同条消息含 **`本次允许修改`**（见 **`frontend-project-goal.mdc`**）。
- 小步推进：一步一文件或一小概念，做完再下一步。
