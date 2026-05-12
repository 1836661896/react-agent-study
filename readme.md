# React 前端学习进度记录（Agent 项目）

> 本前端与 **myproject/backend** 配合，作为 Python Agent 学习项目的 Web 界面。  
> 每次提交代码前，可更新本文件的「最近一次学习」与「下一次学习的起点」。

**给助手（新对话 / 换设备时）**：请先阅读本文件 + **`.cursor/rules/frontend-project-goal.mdc`** + **`.cursor/rules/frontend-study-plan.mdc`** + **`.cursor/rules/react-learning-checklist.mdc`**，以了解：项目前端定位与教学方式、当前阶段与「下一次学习的起点」、React 知识点清单与状态。然后按「当前建议」阶段继续小步教学。

---

## 基本项目信息

- **项目名称**：Agent 项目前端（React）
- **项目位置**：`myproject/frontend`
- **后端项目**：`myproject/backend`（Python + FastAPI），进度见 **backend/readme.md**
- **当前状态**：✅ 已接入后端 API；✅ **阶段 2（组件拆分）已完成**；✅ 布局升级为 **左栏**（`AgentNlRun`、`AgentCommand`、`LastStep`、`StepList`、`TaskSection`）+ **右栏 `ChatPanel`（`POST /chat`）**；🔄 **下一步：阶段 3（请求层与错误体验）** + 待后端 **SSE 流式** 后完善右栏（见下方与 `frontend-study-plan.mdc`）

---

## 后端 API 现状（联调参考）

> 以后端源码 **`backend/src/api.py`** 为准；统一成功结构为 `{ "code": 0, "data": ..., "msg": "..." }`（`code !== 0` 视为业务失败，前端 `http.ts` 会抛 `HttpError`）。

| 接口 | 方法 | 说明 |
|------|------|------|
| /health | GET | 健康检查，返回 `code: 0` 等（**不是**旧版 `{status:"ok"}` 形态） |
| /tasks | GET | 任务列表，`data` 为 `{task_id, task_name}[]` |
| /tasks | POST | 创建任务，请求体 `{"description": "任务内容"}` |
| /tasks/{task_id} | DELETE | 按 `task_id` 删除 |
| /agent/run | POST | Agent 执行，请求体 `{"text": "命令文本"}`（如 `add xxx`） |
| /agent/last-step | GET | 最近一次执行步骤（调试用），无记录时 `code !== 0` |
| /agent/steps | GET | 查询参数 `limit`，返回最近若干条 `Step[]`（新记录在前） |
| /chat | POST | 大模型对话，请求体 `{"message": "..."}`，`data` 为回复字符串 |
| /agent/nl-run | POST | 自然语言 → 白名单命令 → `run_tool`，详见 **backend/readme.md** |

- 任务与操作历史持久化以 **backend** 为准（当前多为 **PostgreSQL + SQLAlchemy**，非 `tasks.json`）；联调前请启动数据库与迁移（见 **backend/readme.md**）。
- **CORS**：后端已允许 `http://localhost:5173`（Vite 默认端口）。
- 启动后端：在 **backend** 目录执行 `uvicorn src.api:app --reload`，默认 `http://127.0.0.1:8000`。

---

## 产品 / 与后端对齐（2026-04-09 对话归档）

- **布局**：左侧展示 **操作历史 / 任务 / Agent 命令**；右侧 **`ChatPanel`** 对话；后续后端 **流式** 时，右侧消费 **SSE/WebSocket** 事件，左侧展示 **统一活动记录**（聊天 / 任务 / 工具等类型），详见 **backend/readme.md →「产品/架构共识」**。
- **大模型分级（后端实现）**：一级路由 + 二级专职模块（聊天、任务、元信息等）为 **渐进目标**，前端可先按「一轮请求 + 刷新 steps/tasks」演进，再接流式与多事件类型。

---

## 最近一次学习（日期：2026-03-17）

### 已完成内容

- ✅ 前端工程从 JS 迁移到 TypeScript（`main.tsx`、`App.tsx`、types、API 封装等）
- ✅ 建立基础请求封装 `src/lib/http.ts`（支持 query/body/headers，错误统一为 `HttpError`）
- ✅ 接入 React Query：任务列表 `useQuery(["tasks"])`，添加/删除用 `useMutation`，成功后 `invalidateQueries(["tasks"])`
- ✅ 健康检查：用 `useEffect` 在页面加载后请求一次 `GET /health`（以 `res.code === 0` 判断成功，与后端 `{code,data,msg}` 一致）
- ✅ **`src/api/agent.ts`**：`runAgent`、`getLastStep`、**`getStepList(limit)`** → `GET /agent/steps?limit=`
- ✅ **`src/types/agent.ts`**：`Step` 与后端字段一致
- ✅ **页面**：Agent 命令、最后一步、**操作历史**（`useQuery(["stepList", limit])` + 列表展示）
- ✅ **阶段 2：组件拆分**：`App.tsx` 仅组合 **`HealthHeader`**、**`AgentCommand`**、**`LastStep`**、**`StepList`**、**`TaskSection`**（`src/components/`）；`AgentCommand` 成功回调 **`invalidateQueries`** **`["lastStep"]`** / **`["stepList"]`**；**`StepList`** 列表 **`key`** 使用 **`${index}-${item.timestamp}`**

### 2026-04-09 补充（工作区未提交变更时的功能摘要）

- **`App.tsx`**：`Row`/`Col` 两栏；**`AgentNlRun`**（`POST /agent/nl-run`）、**`ChatPanel`**（`POST /chat`）；**`StepList`** 可拆为目录组件（如 **`Timeline`** + 错误 **`Alert`/重试**）。
- **`src/api/agent.ts`**：`chatWithLocalModel`、`runNlCommand`；**`src/types/agent.ts`**：`AgentResult`、`Msg`。
- 具体 diff 以本仓库 `git status` 为准；提交后可将本条并入「已完成内容」并更新日期。

---

## 下一次学习的起点（提醒未来的自己）

1. **阶段 3：请求层与错误体验（当前建议）**
   - 参考：`.cursor/rules/frontend-study-plan.mdc`
   - **`http.ts`**：错误分类（网络 / HTTP 状态 / 业务 envelope）；统一 **`message` / `notification`** 文案。
   - **React Query**：对 `tasks`、`lastStep`、`stepList`、**`ChatPanel` mutation`** 等展示 **`isError`** / **`error`**，必要时提供「重试」；可选 **`staleTime`**、**`refetchOnWindowFocus`**。
   - 进阶可选：**AbortController**、请求超时。

2. **阶段 4（随后）**：可扩展 UI（步骤时间线、**与后端统一 activity `type`**、日志结构预留）；**流式 UI** 依赖后端 SSE 契约，见 **backend/readme.md**。

3. **查阅**
   - 前端规则：`.cursor/rules/frontend-project-goal.mdc`
   - 前端阶段：`.cursor/rules/frontend-study-plan.mdc`
   - React 清单：`.cursor/rules/react-learning-checklist.mdc`
   - 后端进度：**backend/readme.md**

---

## 提交前更新流程约定（重要）

> 以后你说「准备提交代码 / 提交代码」时，**默认只指更新并提交本文档与规则文件**，避免把其它前端源码改动混在一次学习记录提交里。

### 默认要更新/提交的文件范围

- ✅ `frontend/readme.md`
- ✅ `frontend/.cursor/rules/frontend-project-goal.mdc`
- ✅ `frontend/.cursor/rules/frontend-study-plan.mdc`
- ✅ `frontend/.cursor/rules/react-learning-checklist.mdc`

### 每次提交前要做的事

1. **更新本文件的“最近一次学习”与“下一次学习的起点”**
2. **更新 React 知识点清单状态**（`react-learning-checklist.mdc`）
3. **确认都已保存后再 git commit**

---

## 备注

- 前端学习风格：用户有 Vue 经验、初学 React，助手会从「Vue 迁移到 React」的视角讲解，并采用小步引导、不直接改代码的方式。
- 前后端进度可分别记录：本文件记录前端进度；后端进度以 **backend/readme.md** 为准；联调时以两处 readme 与规则文件为准。
