# 前后端契约（联调参考）

> **权威接口与字段**以 **`myproject/backend`** 的 **`readme.md`**、**`docs/chat-stream-api.md`**、**`docs/conversations-api.md`**、**`docs/artifacts-api.md`**、**`docs/agent-presets.md`** 及源码为准；本文侧重**前端调用视角**。

---

## 1. 路径约定

- **`myproject/frontend`**、**`myproject/backend`**：文档中的约定路径；不在此记录本机实际克隆目录。

---

## 2. 现行后端已挂载接口（前端应对齐）

| 接口 | 方法 | 说明 |
|------|------|------|
| `/health` | GET | JSON 信封 **`{ code, data, msg }`** |
| `/chat/stream` | POST | **SSE**；**`message`** 与 **`attachment_ids`** 不可同时为空；**`routing`** 默认 **`chat`**；可选 **`preset=guide`**、**`mcp_tool`/`mcp_arguments`**；事件 **`delta` / `error` / `done`**，mcp 另有 **`tool_*`** |
| `/artifact` | POST | **multipart** 字段 **`file`**；成功 `data` 含 **`artifact_id`** 等 |
| `/artifact/{id}` | GET | 下载正文（二进制）；失败可为 JSON fail |
| `/artifact/{id}/meta` | GET | 元数据 JSON 信封 |
| `/conversation/list` | GET | **`ListResult`**；项含 **`updated_at`** 等 |
| `/conversation/create` | POST | **`data: { id }`**；可选 **`kind`** |
| `/conversation/delete` | POST | **`{ ids: number[] }`** |
| `/conversation/{id}/messages` | GET | 每条含 **`attachments`**（可 `[]`） |
| `/user/profile` | GET/PUT | 用户画像（重写 W8 可选） |

---

## 3. 已从后端移除 / 不得再封装

- `/tasks`、`/agent/*`、非流式 **`POST /chat`**、**`GET /events`**
- 旧 **`schedule_draft`** / 以 **`preset=schedule`** 为主身份的产品路径（重建身份为 **`guide`**）

---

## 4. 响应形态约定

- **JSON**：**`code !== 0`** → **`request()`** 抛 **`HttpError`**；失败时 **`data` 可能为 `null`**。
- **SSE**：按行 **`data:`** JSON；见 backend **`docs/chat-stream-api.md`**。
- **上传/下载**：上传走 multipart JSON 信封；下载成功为二进制，勿当信封解析。

---

## 5. 本仓库实现与契约的差距

### 当前（2026-07-20 · W2 半截）

- **策略**：完整重写进行中（§**W**）。旧代码在 **`backup/src/`**；运行入口为新 **`src/`**。
- **新 `src` 已有**：壳 / Health / **`request`**；会话 **types + api**；**`types/chatStream`**（`guide`、`attachment_ids`；SSE 字段对齐后端）。
- **新 `src` 尚未有**：**`api/chatStream`**、artifacts api、聊天业务 UI。
- **目标**见 **`docs/frontend-refactor-plan.md`** §W2～W7。

| 能力 | 新 src | 重写目标 |
|------|--------|----------|
| `/health` | ✅ | W1 |
| `/conversation/*` | ✅ types+api | W5/W6 接 UI |
| `/chat/stream` | ✅ 类型；⏳ api | W2 收尾 / W6 UI |
| `POST /artifact` 上传 | ❌ | ✅ W2/W7 |
| `GET /artifact/{id}` 下载 | ❌ | ✅ W2/W7 |
| `/user/profile` | ❌ | ⏳ W8 |

### 复核记录

- **2026-07-20**：对照重建 backend；选定完整重写；**`study-rewrite-pedagogy.mdc`**。
- **2026-07-20**：W0 迁 **`backup/`**；**W1 ✅**；W2 会话层 + chatStream 类型落地；SSE api 次日。

---

## 6. 环境与 CORS

- 前端开发默认 **`http://localhost:5173`**；**`VITE_API_BASE_URL`** → backend 根 URL。

---

## 7. 启动后端（备忘）

在 **`myproject/backend`**：`uvicorn src.api:app --reload`；见 backend **`readme.md`**。
