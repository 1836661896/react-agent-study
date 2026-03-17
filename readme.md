# React 前端学习进度记录（Agent 项目）

> 本前端与 **myproject/backend** 配合，作为 Python Agent 学习项目的 Web 界面。  
> 每次提交代码前，可更新本文件的「最近一次学习」与「下一次学习的起点」。

**给助手（新对话 / 换设备时）**：请先阅读本文件 + **`.cursor/rules/frontend-project-goal.mdc`** + **`.cursor/rules/frontend-study-plan.mdc`** + **`.cursor/rules/react-learning-checklist.mdc`**，以了解：项目前端定位与教学方式、当前阶段与「下一次学习的起点」、React 知识点清单与状态。然后按「当前建议」阶段继续小步教学。

---

## 基本项目信息

- **项目名称**：Agent 项目前端（React）
- **项目位置**：`myproject/frontend`
- **后端项目**：`myproject/backend`（Python + FastAPI），进度见 **backend/readme.md**
- **当前状态**：✅ 已初始化前端工程（Vite + React + TypeScript）并开始接入后端 API（以代码与下方“最近一次学习”为准）

---

## 后端 API 现状（联调参考）

| 接口 | 方法 | 说明 |
|------|------|------|
| /health | GET | 健康检查，返回 `{"status": "ok"}` |
| /tasks | POST | 创建任务，请求体 `{"description": "任务内容"}`，返回 `{"id": 1, "description": "..."}` |

- 后端与命令行共用任务列表，数据持久化在 backend 的 `tasks.json`。
- 若后端已增加 **GET /tasks**（返回任务列表）和 **CORS**，前端可做「任务列表展示 + 添加任务」；否则可先做「健康检查 + 添加任务」。
- 启动后端：在 **backend** 目录执行 `uvicorn src.api:app --reload`，默认 `http://127.0.0.1:8000`。

---

## 最近一次学习（日期：2026-03-17）

### 已完成内容

- ✅ 前端工程从 JS 迁移到 TypeScript（`main.tsx`、`App.tsx`、types、API 封装等）
- ✅ 建立基础请求封装 `src/lib/http.ts`（支持 query/body/headers，错误统一为 `HttpError`）
- ✅ 接入 React Query：任务列表 `useQuery(["tasks"])`，添加/删除用 `useMutation`，成功后 `invalidateQueries(["tasks"])`
- ✅ 健康检查：用 `useEffect` 在页面加载后请求一次 `GET /health`

---

## 下一次学习的起点（提醒未来的自己）

1. **按学习计划推进（当前建议：阶段 1）**
   - 参考：`.cursor/rules/frontend-study-plan.mdc`
   - 目标：把当前 `App.tsx` 里“健康检查 + 任务列表 + 添加/删除”理解到位（从 Vue 迁移视角）

2. **对接后端**
   - 确认后端是否已提供 **GET /tasks**（任务列表）与 CORS；若无，则前端先保留「健康检查 + 添加任务」最小闭环
   - 若遇跨域，需后端在 FastAPI 中配置 CORS，或先通过代理访问后端。

3. **查阅**
   - 前端规则与教学风格：`.cursor/rules/frontend-project-goal.mdc`
   - 前端学习阶段：`.cursor/rules/frontend-study-plan.mdc`
   - React 知识点清单与状态：`.cursor/rules/react-learning-checklist.mdc`
   - 后端进度与 API 变更：**backend/readme.md**

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
