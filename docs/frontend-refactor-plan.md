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
| 本轮 | §**W0～W8**；默认 **`routing=chat`**、**`preset` 可选**；附件 / 消息正序 |
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

- [x] **W2 类型与 API（可无聊天 UI）**（**2026-07-21**）  
  - [x] `types/common`：`ListQuery` / `ListResult`。  
  - [x] `types/conversations`（**`attachments`**、**`updated_at`**）。  
  - [x] `api/conversations`（list / create / delete / messages）。  
  - [x] `types/chatStream`（**`AgentPreset = "guide"`**、**`attachment_ids`**；SSE 对齐 `text`/`msg`/`tool`）。  
  - [x] **`api/chatStream.ts`**（默认 **`routing=chat`**；`attachment_ids`；Abort `signal`）。  
  - [x] `types/artifacts` + `api/artifacts`（**upload + download**）。  
  - 可选延后：`api/userProfile.ts`（W8）。  
  - `health` 已在 W1。

- [x] **W3 `/chat` 布局 DOM**（**2026-07-21**）  
  - 双栏空壳：左列表区、右线程区、底输入区；占位文案。  
  - **本步无** Query / SSE。

- [x] **W4 布局 CSS**（**2026-07-21**）  
  - 一屏高度链、列表/消息区滚动、composer 不撑破视口。

- [x] **W5 会话列表**（**2026-07-21**）  
  - [x] ③ 拆 `ConversationList` 并挂入 `/chat`。  
  - [x] ④ list / create / delete；选中会话抬到父 state。  

- [x] **W6 线程 + SSE**（**2026-07-22** 收尾）  
  - [x] ③ 拆 `ChatThreadPanel` 空壳（消息区 + composer）。  
  - [x] ④ messages Query；发送 SSE（默认 **`chat`**；**不硬编码 preset**）；流式气泡；`done` → invalidate。  
  - [x] 乐观用户气泡；**`routing`：`chat` | `auto`**。  
  - [x] 历史展示：对接口降序 **`records` 按 `id` 升序**再渲染。  
  - [x] **`tool_call` / `tool_result` 抽屉展示**  
    - UX：有数据默认展开；流结束自动收起；数据保留可再开（非流式临时气泡）。  
    - [x] ① DOM 占位 + ② CSS（`chat-page__tool-drawer` / `is-open`）。  
    - [x] ③ `onToolCall` / `onToolResult` 壳（antd `Button`）。  
    - [x] ④ `toolItems`（稳定 `id`）+ `toolsOpen` 与真实渲染。

- [x] **W7 附件**（**2026-07-22**）  
  - composer：antd（`Radio` / `Input.TextArea` / `Upload` / `Button` / `Tag` / `Image`）。  
  - 选文件 + **粘贴任意文件** → 大小校验 → **`POST /artifact`** → 待发（图缩略图 / 非图文件名）→ 发送 **`attachment_ids`**。  
  - 历史：`attachments` 有则展示（图预览 / 文件名 Tag）+ 点击下载。  
  - 切换会话清理 pending（revoke）/ tool；发送前 revoke 预览 URL。  
  - **暂不做**：剪贴板「文字+文件」同时保留。  
  - [x] ① DOM → ② CSS → ③ 引用 → ④ 逻辑  

- [x] **W8′ 固定 auto + 身份 + 展示**（**2026-07-23**）  
  - [x] 去掉 composer **`chat`/`auto` Radio**；发送体**显式** `routing: "auto"`。  
  - [x] **身份**：本地「普通」+ **`GET /dict/presets`** 拉表；`identity !== "normal"` → `preset = value`。  
  - [x] **antd 展示**：`ConversationList` Button/Modal/Empty/Alert；`ChatThreadPanel` 状态区 + 历史图 Button + 工具 **Collapse**。  
  - [x] **Enter 发送 / Shift+Enter 换行**（`onKeyDown`，忽略 IME composing）。  
  - [x] 契约备忘：**`docs/antd-api-notes.md`**；废 **`/agent/presets`**。  

- [ ] **其后（与 backend 语音前排期对齐）**  
  - [x] **R4b.2** 附件解析联调（调 MCP）**已验收**（2026-07-24；含 JSON 下载修复）  
  - [ ] **失败可见 / Abort** UI（等 backend 协议）← **下一步**  
  - **`routing=plan`** UI/联调（随 backend）  
  - 再后：**语音**  

- [ ] **暂不做**  
  - 用户画像 GET/PUT 设置页（期望后端自主提取 V2）  
  - composer 暴露 **`chat` / `mcp`**；具名能力 → `mcp_tool`（可更后）

- [ ] **收尾**  
  - `npm run lint`；更新 **`readme`** 功能表、契约 §5、**`changelog`**、checklist。

---

## 验收（主路径）

1. Health 绿；能建会话、发消息、续聊（落库后列表有标题）。  
2. Network：日常 **`routing: "auto"`** 且**无** `preset`；切导游后有 **`preset`**（值为字典 `value`，如 `guide`）；请求 **`GET /dict/presets`**；**无** chat/auto 切换。  
3. 消息列表**旧上新下**。  
4. 上传后发送可见 **`attachments`** 并可下载；**只发附件**时收到 backend 固定「尚未解析」说明（解析完成前）。  
5. `auto` 触发 MCP 时可见 **`tool_call` / `tool_result`**（Collapse）。  
6. Enter 发送；Shift+Enter 换行；IME 组字中 Enter 不误发。

---

## 非目标（本轮不做）

- 恢复 **`schedule` / schedule_draft / 旧 A1③ composer 导出快捷**  
- 左侧真实活动流、多 part 气泡（随 **`plan`**）  
- WebSocket 通话 UI（语音阶段）  
- **用户画像设置页**  

---

*修订：2026-07-20 — 完整重写 §W。2026-07-22 — 默认无 preset、消息正序。2026-07-23 — 固定 `auto`、通用字典 `/dict/presets`、antd 展示、Enter 发送。2026-07-24 — R4b.2 验收；下一步失败可见/Abort。*
