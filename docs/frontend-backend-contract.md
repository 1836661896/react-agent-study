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
| `/chat/stream` | POST | **SSE**（`text/event-stream`）；请求体 **`ChatRequest`**：`message`（必填）、`conversation_id`（可选）、`routing`（默认 `auto`） |
| `/conversation/list` | GET | 会话列表；成功 **`data`** 为 **`ListResult`** |
| `/conversation/{conversation_id}/messages` | GET | 消息历史；分页与筛选见 backend 文档 |

---

## 3. 已从后端移除的接口（本仓库可能仍有遗留调用）

以下**不应再作为现网联调目标**；旧版曾在 **`src/api/*.ts`** 中封装，**当前 R2 骨架下已无 `src/api` 目录**；若日后误加下列路径的封装应删除。

- `/tasks`（GET/POST）、`/tasks/{task_id}`（DELETE）
- `/agent/run`、`/agent/last-step`、`/agent/steps`、`/agent/nl-run`
- 非流式 **`POST /chat`**
- **`GET /events`**

---

## 4. 响应形态约定

- **JSON 接口**（如 `/health`、`/conversation/*`）：与后端一致，**`code !== 0`** 视为业务失败；前端 **`src/utils/request.ts`** 中 **`request()`** 抛 **`HttpError`**（与旧文档中的 **`http.ts`** 指同一职责时可替换表述）。
- **SSE**（`/chat/stream`）：**不按** JSON 信封解析；按行解析 **`data:`** 后 JSON，事件类型 **`delta` / `error` / `done`** 等，详见 **backend `docs/chat-stream-api.md`**。

---

## 5. 本仓库实现与契约的差距

> **策略说明**：前端已**整目录移除旧 `src/` 后重写**（见 **`docs/frontend-refactor-plan.md`**）。**§5「重写前」**为 git 对照；**「当前实现」**随阶段更新。

### 当前实现（R2 骨架，2026-05-15）

- **已有**：**`src/utils/request.ts`**（**`request` + `HttpError`**，JSON 信封）、**`src/config/env.ts`**、**`src/types/common.ts`**、**`main.tsx` / `App.tsx`**、样式、**`vite-env.d.ts`**；**`index.html`** → **`/src/main.tsx`**。
- **未有**：**`src/api/conversation.ts`**、**`src/api/chatStream.ts`**、会话/聊天 UI、**`GET /health`** 页面调用。
- **与契约**：尚未对接 **`/conversation/*`** 与 **`/chat/stream`**；**R3～R4** 补齐。

### 重写前（历史快照，git 对照）

- **`ChatPanel` + `chatWithLocalModelStream`**：请求体仅 **`message`**；**`done`** 未解析 **`conversation_id` / `turn_id`**。
- **`chatStream.ts`**：`SsePayload` 的 **`done`** 类型与无参 **`onDone()``** 与 **`myproject/backend/docs/chat-stream-api.md`** 不一致。
- **会话**：无 **`GET /conversation/*`** 的 API 封装与 UI。

### 复核记录

- **2026-05-15**：新 **`src`** 已落地 R2；本节增加「**当前实现**」与 §3 脚注。

## 6. 环境与 CORS

- 前端开发默认 **`http://localhost:5173`**；后端 CORS 示例允许该来源（以 **backend `src/api.py`** 为准）。
- 前端 API 基址：**环境变量 `VITE_API_BASE_URL`**（见 **`src/config/env.ts`**），需指向 backend 根 URL（如 `http://127.0.0.1:8000`）。

---

## 7. 启动后端（备忘）

在 **`myproject/backend`** 目录：`uvicorn src.api:app --reload`（默认 `http://127.0.0.1:8000`）；数据库与迁移见 **backend `readme.md`**。
