# 学习进度与文档提交约定

> **学习节奏与「下一步」**；**不替代**根目录 **`readme.md`** 中的功能模块表。

---

## 最近一次学习（2026-06-29 · 文档对齐 + 架构小 refactor）

- **代码梳理**：A1 ② **artifact 下载** 已在 **`artifactParse` / `artifacts` / `useChatThreadPanel` / `ChatThreadPanel`** 落地；文档此前仍写「待做」，本日同步 **`readme`**、契约、规则。
- **结构**：**`ChatThreadPanel`** 拆 **`useChatThreadPanel.ts`**；**`queryKeys`**、**`ROUTES`**、**`buildApiUrl`** 集中常量/工具。
- **对照 Vue**：api 层 **`fetch` 二进制** 不走 JSON 信封；纯函数 **`parseArtifactIdFromToolResult`** 与 React 组件分离。

---

## 最近一次学习（2026-06-26 · backend A1 行程助手 · preset）

- **类型与 API**：**`AgentPreset`**、**`PostChatStreamBody.preset`** → **`api/chatStream.ts`** 组 payload（api 层决定最终 JSON，组件只传 body）。
- **Props**：**`ChatThreadPanel`** 接收 **`preset?`**；父 **`ChatPage`** 用 **`activePreset`** 下发（对照 Vue **`:preset`**）。
- **useState + 状态提升**：**`presetByConvId: Record<number, AgentPreset>`** 放在 **`ChatPage`**；**`ConversationList`** 通过 **`onScheduleSessionCreated(id)`** 通知父组件登记 **schedule**（对照 Vue **emit + 父 ref**）。
- **React Query**：**`createMutation.mutate(..., { onSuccess })`** 在单次调用上追加回调，与 **`useMutation` 内 onSuccess** 叠加执行。
- **联调**：Network 确认 **行程助手** 会话 **`preset: "schedule"`**；助手按行程规划师口吻回复。

---

## 下一次学习的起点

> **目标**：完成 **backend A1** 联调验收与剩余项；再进入阶段 4（Abort、能力按钮等）。

1. **验收（优先）**：**`myproject/backend/docs/skills/trip-assistant.md` §6** 四轮对话 — 第 4 轮 **`tool_call` → `tool_result` → 点击「下载文件」** 得到 docx。
2. **A1 ③（可选）**：composer 快捷 **导出 docx / pdf**（**`preset=schedule`** 会话可见；需确认后端/MCP 契约）。
3. **阶段 4**：流式 **AbortController** 接 UI（**`postChatStream` 已支持 `signal`**）；具名能力按钮 → **`mcp_tool`**。

---

## 提交前约定（文档 + 代码）

### 建议纳入本次提交的文件

**文档（2026-06-29 批次）**

- `readme.md`
- `docs/changelog.md`、`docs/study-progress.md`、`docs/frontend-backend-contract.md`
- `.cursor/rules/study-plan.mdc`、`study-learning-checklist.mdc`、`study-project-goal.mdc`

### 每次提交前

1. **`npm run lint`**
2. 后端可联调时：**行程助手** 带 preset；**tool_result** 含 artifact 时可下载
3. 更新 **`readme.md`** 功能表与 **`changelog.md`**

---

## 教学风格（摘要）

- 默认不工具改 **`src/**`**，除非同条消息含 **`本次允许修改`**（见 **`study-project-goal.mdc`**）。
- 小步推进：一步一文件或一小概念，做完再下一步。
