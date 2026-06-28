# 前端重构执行计划（与现行 `myproject/backend` 对齐）

> **用途**：落地「**会话列表 + 消息历史 + 流式聊天**」+ 左栏占位；本仓库**当前选定策略**为：**不考虑保留现有 `src/` 实现，整目录移除后完全重写**。  
> **权威契约**：**`docs/frontend-backend-contract.md`**；字段级约定：**`myproject/backend/docs/chat-stream-api.md`**、**`myproject/backend/docs/conversations-api.md`**。  
> **产品构想**：**`docs/product-roadmap.md`**。  
> **代码修改**：按 **`.cursor/rules/frontend-project-goal.mdc`**。删除或重建 **`src/`**、修改 **`index.html`** 等，须用户当条消息含**一字不差**的 **`本次允许修改`**；否则仅口述步骤或由用户本地操作。

---

## 选定方案：移除整个 `src/` 后重写

### 含义

- **不迁移**旧组件（`AgentCommand`、`TaskSection`、`ChatPanel` 等）；旧实现仅以 **git 历史**可查。
- **重新建立**最小 Vite + React + TS 入口，再按契约逐文件增加 **`api/*`**、**会话/流式类型**、HTTP 封装（当前为 **`utils/request.ts`**，与计划示例 **`lib/http.ts`** 等价可选）、布局与业务组件。
- **仓库根**保留：**`package.json`**、**`vite.config.*`**、**`tsconfig*.json`**、**`eslint.config.*`**、**`.env.*`**、**`index.html`**（内容可能需与新的 `main.tsx` 路径对齐）、**`docs/`**、**`readme.md`**。

### 与「在旧 `src` 上删改」相比

| 项 | 整目录重写 | 在旧代码上修补 |
|----|------------|----------------|
| 心智负担 | 低（无历史包袱） | 需追踪遗留引用 |
| 风险 | 须一次搭好入口与别名；**`index.html` 脚本路径**易错 | 易漏删 **`@/api/agent`** 等引用 |
| 权限 | 删 **`src/`** 属工具改源码，须 **`本次允许修改`** | 同上 |

### 已知工程细节（执行时检查）

- 根目录 **`index.html`** 当前若仍指向 **`/src/main.jsx`**，而实际入口为 **`main.tsx`**，重写时应改为 **`/src/main.tsx`**（或与 Vite 模板一致），避免白屏。

---

## 0. 目标与非目标

### 目标

- **主区**：会话列表 + 当前会话消息列表 + 输入区发送；**`POST /chat/stream`**，消费 **`delta` / `error` / `done`**，使用 **`done.conversation_id` / `turn_id`** 与会话状态同步。
- **布局**：左侧**仅占位**（无后端请求）；中为会话列表；右为聊天（列宽以最终实现为准，并同步 **`readme.md`** §2）。
- **不保留**对已下线路由的任何调用（见 **`frontend-backend-contract.md`** §3）。

### 非目标

- 左侧真实活动流、**`routing=plan|mcp`** 产品化、富消息块等——仍按原 **`docs/product-roadmap.md`** 与上文「非目标」处理。

---

## 1. 基线与验收（重写前后都需要）

- [x] **1.1** **`myproject/backend`** 可启动；**`VITE_API_BASE_URL`** 正确；顶栏 **`HealthBage`** 展示 **`GET /health`**（2026-05-17）。  
  - *历史记录*：见文末「执行记录」。
- [x] **1.2** 已阅读 **`frontend-backend-contract.md`**；选定整目录重写后，**首次新 `src` 合入**时须重写该文件 **§5**（从「空白实现」描述差距，而非旧代码）。

---

## R. 整目录重写阶段（主路径）

> 下列步骤在 **`本次允许修改`** 授权下可由助手代做；否则请用户按顺序本地操作。

- [ ] **R0**（建议）：**`git checkout -b`** 新分支，或至少 **`git commit -am "chore: snapshot before src wipe"`**，便于回滚。
- [x] **R1**：删除整个 **`src/`** 目录（及仅被旧代码使用的 **`src` 外**残留，若有）。
- [x] **R2** **最小可运行骨架**  
  - **`src/main.tsx`**：挂载根组件；**`BrowserRouter`**；**`QueryClientProvider`**；**`antd` `ConfigProvider`（zhCN）**。  
  - **`src/App.tsx`** + **`src/styles/*.scss`**；**`App`**：**`Routes`**（**`/`**、**`/chat`**、**`*`**）与顶栏导航。  
  - **`src/config/env.ts`**：**`VITE_API_BASE_URL`**。  
  - **JSON 封装**：已实现为 **`src/utils/request.ts`**（**`request` + `HttpError`**），与计划中的 **`src/lib/http.ts`** 职责等价（可后续再统一到 `lib/` 命名）。  
  - **`index.html`** → **`/src/main.tsx`**（已对齐）。  
  - **`npm run dev`** 可打开 R2 占位页。
- [x] **R3** **类型与 API**  
  - **已完成（会话 JSON）**：**`src/types/conversations.ts`**、**`src/types/common.ts`**；**`src/api/conversations.ts`**：**`GET conversation/list`**、**`POST conversation/delete`**、**`POST conversation/create`**、**`GET conversation/{id}/messages`**。  
  - **已完成（流式）**：**`src/types/chatStream.ts`**、**`src/api/chatStream.ts`**：**`POST /chat/stream`**；**`delta` / `tool_call` / `tool_result` / `error` / `done`**；**`done`** 后 **`invalidateQueries`**。  
  - *计划文件名曾写作 `conversation.ts`（单数）；实际仓库为 **`conversations.ts`**。*
- [x] **R4** **UI 与布局**（主路径，2026-05-17）  
  - **已完成**：双栏 **`/chat`**、**`ConversationList`**、**`ChatThreadPanel`**（infinite、SSE、**自动/对话** 模式、**toolTrace**、乐观气泡）；顶栏 **`HealthBage`** + **`api/health.ts`**。  
  - **待完成 / 阶段 4**：三栏左占位；流式 **Abort**；composer **具名能力按钮**（非 MCP 模式切换）。
- [ ] **R5** **收尾**  
  - [x] **`npm run lint`**（2026-05-17 已通过，提交前建议再跑）。  
  - [x] 文档：**`readme`**、**`frontend-backend-contract` §5**、**`changelog`**、**`study-progress`**（本批）。  
  - [ ] 冒烟联调记录（可选写入 changelog）。

---

## 6. 后续迭代

- 快捷 **`routing`**、SSE 富类型、左侧活动流等——仍见 **`docs/product-roadmap.md`** 与后续计划。

---

## 执行记录（滚动）

| 日期 | 内容 |
|------|------|
| 2026-06-26 | **backend A1 ①**：**`preset=schedule`** 类型 + **api/chatStream** + **ChatPage/ConversationList/ChatThreadPanel**（行程助手入口、状态提升）；Network 验证通过。**待续**：artifact 下载、§6 四轮验收。 |
| 2026-05-14 | 完成 §**1.2**（旧代码）契约复核；**`frontend-backend-contract.md`** §5 曾对照旧 `src`。 |
| 2026-05-17 | **R4 收尾**：**health**、SSE **tool_***、模式 **auto/chat**；文档与 **lint** 同步。阶段 4：能力按钮、Abort。 |
| 2026-05-17（早） | **R3/R4 续**：**create/messages**；双栏 + **`ChatThreadPanel`**。 |
| 2026-05-15（续） | **SSE `chatStream`**、消息 **`useInfiniteQuery`**、**`/chat` 子目录**、**page 夹紧**、**选中行缓存同步**、**`datetime`**、**一屏 flex 布局**；§R 勾选与 **`readme`** 同步。下一步 **`GET /health`**、**`npm run lint`**。 |
| 2026-05-16 | **R3/R4 部分推进**：会话 **list/delete** API 与类型；**`ConversationList`**；**`react-router-dom`** 与 **`pages/*`**。详见 **`docs/changelog.md`**。 |
| 2026-05-15 | **R1/R2** 落地：新 **`src`** 含 **`utils/request.ts`**、**`config/env`**、**`types/common`**、**`main`/`App`**、样式；**`readme`**/**`frontend-backend-contract`** 已同步当前架构。下一步 **R3**。 |
| 2026-05-14 | **策略变更**：改为**整目录删除 `src/` 后全文重写**；本文件结构改为 **§R** 主路径。 |
| 待定 | **R3～R5** 及 **`src/`** 改动：须用户本地编辑，或当条消息含 **`本次允许修改`** 并写清范围后助手方可代写。 |

---

*修订：2026-05-14 起以「移除 `src/` 全文重写」为默认执行路径。*
