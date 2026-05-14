# 产品对齐与构想

> **方向与排期讨论**；**实现程度**以根目录 **`readme.md`** 中的功能表为准。

---

## 与后端长期方向的关系

- 后端已明确**以流式聊天为主**（见 **`myproject/backend/readme.md`**）；前端主界面与之对齐：**会话 + 消息历史 + 流式发送**。

---

## 近期产品构想

1. **主聊天区**：展示当前会话消息；发送走 **`POST /chat/stream`**；历史来自 **`GET /conversation/{id}/messages`**（分页等行为以后端文档为准）。
2. **会话列表**：**`GET /conversation/list`**；前端已实现列表与 **`POST /conversation/delete`**（多选/批删）；**`POST /conversation/create`** 与消息区待接。新建会话也可由首次流式 **`done`** 返回的 **`conversation_id`** 驱动（见 **backend `docs/chat-stream-api.md`**）。
3. **快捷调用（类豆包）**：在输入框上方或附近放置按钮，用于快速切换「大模型侧身份」——对应后端 **`routing`** 或后续 **skill / MCP** 契约；具体选项以后端实现与占位状态为准（**`plan` / `mcp`** 可能仍为占位）。
4. **左侧栏**：展示「历史操作 / 活动流」为**构想**，可能随内置功能增多改到左侧其它区域或与后端统一 **activity** 类型后再实现。

---

## 流式富内容（后续）

若 SSE 扩展出工具确认、终端代码块、卡片等，前端以**组件化消息行**渐进承接；事件形态以后端 **`docs/chat-stream-api.md`** 更新为准。
