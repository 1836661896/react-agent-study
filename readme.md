# React 前端学习进度记录（Agent 项目）

> 本前端与 **myproject/backend** 配合，作为 Python Agent 学习项目的 Web 界面。  
> 每次提交代码前，可更新本文件的「最近一次学习」与「下一次学习的起点」。

**给助手（新对话 / 换设备时）**：请先阅读本文件与 **`.cursor/rules/frontend-project-goal.mdc`**，了解前端定位、当前进度及后端 API 状态，再继续教学或开发。

---

## 基本项目信息

- **项目名称**：Agent 项目前端（React）
- **项目位置**：`myproject/frontend`
- **后端项目**：`myproject/backend`（Python + FastAPI），进度见 **backend/readme.md**
- **当前状态**：前端尚未搭建（待创建 React 应用并接入后端 API）

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

## 最近一次学习（日期：待填写）

### 已完成内容

- （暂无：前端项目尚未开始搭建）

---

## 下一次学习的起点（提醒未来的自己）

1. **创建 React 应用**（若尚未创建）
   - 使用 Create React App 或 Vite + React 在 `frontend` 目录下初始化项目。
   - 确认能本地运行（如 `npm start` / `npm run dev`）。

2. **对接后端**
   - 调用 **GET /health** 做健康检查（如页面加载时请求一次）。
   - 调用 **POST /tasks** 实现「添加任务」表单；若后端已提供 GET /tasks，再实现任务列表展示。
   - 若遇跨域，需后端在 FastAPI 中配置 CORS，或先通过代理访问后端。

3. **查阅**
   - 前端规则与教学风格：`.cursor/rules/frontend-project-goal.mdc`
   - 后端进度与 API 变更：**backend/readme.md**

---

## 备注

- 前端学习风格：用户有 Vue 经验、初学 React，助手会从「Vue 迁移到 React」的视角讲解，并采用小步引导、不直接改代码的方式。
- 前后端进度可分别记录：本文件记录前端进度；后端进度以 **backend/readme.md** 为准；联调时以两处 readme 与规则文件为准。
