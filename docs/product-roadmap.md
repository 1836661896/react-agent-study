# 产品对齐与构想

> **方向与排期讨论**；**实现程度**以根目录 **`readme.md`** 中的功能表为准。

---

## 与后端长期方向的关系

- 后端已明确**以流式聊天为主**（见 **`myproject/backend/readme.md`**）；前端主界面与之对齐：**会话 + 消息历史 + 流式发送**。

---

## 近期产品构想

1. **主聊天区（已落地）**：**`useInfiniteQuery`** 拉历史；**`POST /chat/stream`** 流式发送；**`done`** 后刷新列表与消息。SSE **`tool_call` / `tool_result`** 以流式 **工具条**（**`toolTrace`**）展示，最终正文仍以 **`delta`** 与落库历史为准。
2. **会话列表（已落地）**：**list / delete / create**；右侧选中会话展示消息；标题与列表缓存同步（**`ChatPage` queryCache 订阅**）。
3. **对话模式（2026-07-23 口径）**  
   - **用户可见唯一开关**：**身份** — 「普通」（不传 `preset`）+ **`GET /dict/presets`** 下发项（`value` 作 `preset`）。  
   - **routing**：前端日常**固定** `auto`，**不**再提供 chat/auto 手动切换；分流靠 backend。  
   - **不暴露**：「MCP」协议级切换或手写 **`mcp_tool`**（工程师联调走 API/curl）。  
   - **MCP 执行**：由 **`auto`** 或日后 **具名能力按钮** 触发；按钮内部映射 **`mcp_tool`**，对用户只显示功能名。  
   - **快捷键**：Enter 发送；Shift+Enter 换行。
4. **健康状态（已落地）**：顶栏 **`GET /health`** 标签（**`HealthBage`**）。
5. **左侧栏**：活动流仍为**构想**；当前为 **双栏**（列表 | 聊天），三栏左占位见 **`frontend-refactor-plan.md`**。

---

## 流式富内容（后续 · 阶段 4）

- **具名能力按钮**：composer 下方或 Segmented 旁，配置表驱动 **`postChatStream`**（**`mcp`** + 工具名或增强 **`message`**）。  
- **富消息块**：工具确认、代码块、卡片等，以组件化消息行承接；事件形态以后端 **`docs/chat-stream-api.md`** 为准。  
- **停止生成**：**`AbortController`** 与 UI「停止」按钮。
