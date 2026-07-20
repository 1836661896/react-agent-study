# 前端重构执行计划（完整重写 · 对齐重建后端）

> **选定策略（2026-07-20）**：**删除整个 `src/`** 后按 **重建 `myproject/backend`** 契约重写。  
> **教学节奏**：**`.cursor/rules/study-rewrite-pedagogy.mdc`**（①DOM → ②CSS → ③引用 → ④逻辑；禁止一次给整页完整代码）。  
> **改码**：删写 **`src/**` / `index.html`** 须用户消息含 **`本次允许修改`**。  
> **权威契约**：**`docs/frontend-backend-contract.md`** + backend **`docs/chat-stream-api.md`** 等。

---

## 0. 与上一轮 §R 的关系

| 项 | 说明 |
|----|------|
| 历史 §R1～R4 / 旧 A1（`schedule`） | **归档**；实现仅在 **git 历史**可查，不迁移组件 |
| 本轮 | §**W0～W8**；字段从第一天起对齐 **`guide` / 附件 / 默认 `chat`** |
| 工程根 | **保留** `package.json`、Vite/TS/ESLint、`.env*`、`docs/`、规则；**重写** `src/`；`index.html` 入口按需对齐 |

---

## W. 完整重写阶段

- [x] **W0 快照与迁移**（2026-07-20）  
  - 用户已将整目录旧 **`src/`** 迁至 **`backup/src/`**；**`index.html`** 仍指向 **`/src/main.tsx`**。  
  - 旧实现仅作对照，**不迁业务组件**。

- [x] **W1 空壳可跑**（**2026-07-20**）  
  - [x] `main.tsx`：`BrowserRouter`、`QueryClientProvider`、antd `zhCN`。  
  - [x] 顶栏 + `Routes`（`/`、`/chat`、`*`）占位页；**样式**一屏高度（`styles/main.scss`、`App.scss`）。  
  - [x] `config/env.ts`、`types/common`（信封）、`utils/url.ts`。  
  - [x] **`utils/request.ts`** + **`api/health`** + 顶栏 **HealthBage**。  
  - 教学约定：用户单独回复 **`1`**；**UI 组件**严格 **①DOM → ②CSS → ③引用 → ④逻辑**（Health 过简曾整给，后续不再）。

- [ ] **W2 类型与 API（可无聊天 UI）**（**进行中 · 2026-07-20**）  
  - [x] `types/common`：`ListQuery` / `ListResult`。  
  - [x] `types/conversations`（**`attachments`**、**`updated_at`**）。  
  - [x] `api/conversations`（list / create / delete / messages）。  
  - [x] `types/chatStream`（**`AgentPreset = "guide"`**、**`attachment_ids`**；SSE 对齐 `text`/`msg`/`tool`）。  
  - [ ] **`api/chatStream.ts`**（默认 **`routing=chat`**）← **下次**。  
  - [ ] `artifacts` 类型 + api（**upload + download**）。  
  - 可选：`api/userProfile.ts`。  
  - `health` 已在 W1。

- [ ] **W3 `/chat` 布局 DOM**  
  - 双栏空壳：左列表区、右线程区、底输入区；占位文案即可。  
  - **本步无** Query / SSE。

- [ ] **W4 布局 CSS**  
  - 一屏高度链、列表/消息区滚动、composer 不撑破视口。

- [ ] **W5 会话列表逻辑**  
  - list / create / delete；选中会话抬到父 state（对照 Vue emit）。

- [ ] **W6 线程 + SSE**  
  - messages（infinite 可后置）；发送；**`preset=guide`** 入口；模式 **`chat` | `auto`**；`tool_*` 展示；`done` → `invalidateQueries`。

- [ ] **W7 附件**  
  - composer：选文件 → **`POST /artifact`** → 待发送 `attachment_ids`。  
  - 历史气泡：渲染 **`attachments`** + 下载。  
  - 教学：再走一遍 ①～④。

- [ ] **W8 可选**  
  - 画像 GET/PUT UI；Abort 按钮；具名能力 → `mcp_tool`（非模式切换）。

- [ ] **收尾**  
  - `npm run lint`；更新 **`readme`** 功能表、契约 §5、**`changelog`**、checklist。

---

## 验收（主路径）

1. Health 绿；能建会话、发消息、续聊（落库后列表有标题）。  
2. Network：`preset: "guide"`（导游会话）；日常 `routing: "chat"`。  
3. 上传文件后发送，messages 中可见 **`attachments`** 并可下载。  
4. 显式或 auto 触发 MCP 时可见 **`tool_call` / `tool_result`**。

---

## 非目标（本轮不做）

- 恢复 **`schedule` / schedule_draft / 旧 A1③ composer 导出快捷**  
- 左侧真实活动流、**`routing=plan`** 产品化、多 part 气泡  
- WebSocket 通话 UI  

---

*修订：2026-07-20 — 用户选定完整重写；清单由 §R 切换为 §W。*
