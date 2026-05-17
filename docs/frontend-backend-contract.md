# 前后端契约（联调参考）

> **权威接口与字段**以 **`myproject/backend`** 的 **`readme.md`**、**`docs/chat-stream-api.md`**、**`docs/conversations-api.md`** 及源码为准；本文侧重**前端调用视角**与**本仓库代码现状**。

---

## 1. 路径约定

- **`myproject/frontend`**、**`myproject/backend`**：文档中的约定路径；不在此记录本机实际克隆目录。

---

## 2. 现行后端已挂载接口（前端应对齐）

| 接口 | 方法 | 说明 |
|------|------|------|
| `/health` | GET | JSON 信封 **`{ code, data, msg }`** |
| `/chat/stream` | POST | **SSE**；**`ChatRequest`**：`message`（必填）、`conversation_id`（可选）、`routing`（默认 **`auto`**）；显式 **`routing=mcp`** 时需 **`mcp_tool`**（前端日常发送走 **auto/chat**，能力按钮可日后传 **mcp**） |
| `/conversation/list` | GET | 会话列表；成功 **`data`** 为 **`ListResult`** |
| `/conversation/create` | POST | 新建空会话；成功 **`data`** 为 **`{ id }`** |
| `/conversation/delete` | POST | 批量删除；body **`{ ids: number[] }`** |
| `/conversation/{conversation_id}/messages` | GET | 消息历史；分页与 **`role`** 筛选见 backend 文档 |

---

## 3. 已从后端移除的接口（本仓库不得再封装）

- `/tasks`（GET/POST）、`/tasks/{task_id}`（DELETE）
- `/agent/run`、`/agent/last-step`、`/agent/steps`、`/agent/nl-run`
- 非流式 **`POST /chat`**
- **`GET /events`**

---

## 4. 响应形态约定

- **JSON**（`/health`、`/conversation/*`）：**`code !== 0`** → **`request()`** 抛 **`HttpError`**。
- **SSE**（`/chat/stream`）：按行 **`data:`** JSON；类型含 **`delta`**、**`error`**、**`done`**；**`mcp` / `auto→mcp`** 另有 **`tool_call`**、**`tool_result`**（见 backend **`docs/chat-stream-api.md`**）。

---

## 5. 本仓库实现与契约的差距

### 当前实现（2026-05-17）

- **JSON**：**`utils/request.ts`**；**`api/conversations.ts`**（list / delete / create / messages）；**`api/health.ts`**。
- **SSE**：**`api/chatStream.ts`** 解析并分发 **`delta` / `tool_call` / `tool_result` / `error` / `done`**；类型 **`types/chatStream.ts`**。
- **布局**：**`/chat`** 双栏；**`App`** 顶栏 **`HealthBage`**（**`components/HealthBage.tsx`**，文件名拼写以仓库为准）。
- **聊天区**：**`ChatThreadPanel`** — **`useInfiniteQuery`** 消息；发送 **`routing`** 仅 UI 暴露 **`auto` | `chat`**（类型 **`ChatUiRoutingMode`**）；**`auto→mcp`** 时 **`toolTrace`** 展示工具过程；**`done`** 后 **`invalidateQueries`**（messages infinite、list）。
- **未有 / 待做**：流式 **Abort**；composer **具名能力按钮**（内部可映射 **`routing=mcp` + mcp_tool**）；三栏左占位；**`routing=plan`** 产品化。

### 与契约对齐情况

| 能力 | 状态 |
|------|------|
| `/health` | ✅ 顶栏 |
| `/conversation/*` | ✅ |
| `/chat/stream` 基础事件 | ✅ |
| MCP 工具 SSE 展示 | ✅（非用户可选模式） |
| 用户选 MCP + 手写工具名 | ❌ 已按产品约定移除 |
| 能力按钮 → `mcp_tool` | ⏳ 阶段 4 |

### 重写前（历史快照）

- 无会话 API/UI；**`done`** 未用；SSE 类型与 backend 不一致。

### 复核记录

- **2026-05-15**：R2 + `/chat` 子目录、infinite 消息、page 夹紧、缓存同步标题。
- **2026-05-16**：list/delete + 路由页。
- **2026-05-17（早）**：create/messages、双栏 ChatThreadPanel。
- **2026-05-17（晚）**：health、SSE **tool_***、模式仅 auto/chat；§5 与本表同步。

---

## 6. 环境与 CORS

- 前端开发默认 **`http://localhost:5173`**；后端 CORS 允许该来源（以 **backend `src/api.py`** 为准）。
- **`VITE_API_BASE_URL`** → backend 根 URL（如 `http://127.0.0.1:8000`）。

---

## 7. 启动后端（备忘）

在 **`myproject/backend`**：`uvicorn src.api:app --reload`；数据库与迁移见 backend **`readme.md`**。
