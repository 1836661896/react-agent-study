# 学习进度与文档提交约定

> **学习节奏与「下一步」**；**不替代**根目录 **`readme.md`** 中的功能实现表。

---

## 最近一次学习（2026-05-14）

- 前端工程：TypeScript、**`src/lib/http.ts`**、React Query、健康检查、左栏（Agent / 任务 / 步骤 / 事件时间线等）与右栏 **`ChatPanel`** 等（详见历史提交）。
- **文档**：与 **`myproject/backend`** 文档分工对齐——根 **`readme.md`** 聚焦真相与架构；说明类内容拆至 **`docs/`**（见 **`documentation-index.md`**）。
- **重构 §1 基线**：已完成 **`docs/frontend-refactor-plan.md`** 之 **1.2**（旧 `src` 契约差距已记入 **`frontend-backend-contract.md`** §5 历史快照）；**1.1** 待后端启动后确认 **`GET /health`**（新骨架中的健康展示可再实现）。
- **策略（2026-05-14）**：**不保留现有 `src/`**，按 **`frontend-refactor-plan.md`** §**R** 整目录删除后重写；执行删改须当条消息含 **`本次允许修改`**。

---

## 下一次学习的起点

> **执行顺序以 **`docs/frontend-refactor-plan.md`** 为准**（从零开始的勾选清单）；以下为摘要。

1. **授权执行 §R**：若由助手用工具删除 **`src/`** 并搭建新骨架，当条消息须含 **`本次允许修改`**；或你本地删除 **`src/`** 后让我只提供可复制文件清单。
2. **顺序**：**`frontend-refactor-plan.md`** **R0 → R1 → … → R5**；**1.1** 可在 **R4** 有健康检查后勾选。
2. **阶段 3～4**：**`conversation` API + 类型**、**`chatStream` 完整请求体与 `done` 解析**；会话列表 + 消息历史 + **`ChatPanel`** 联调；见计划 §3～§4。
3. **阶段 5**：删除遗留 **`api/agent|tasks|events`** 与相关组件；**`lint`** 与文档（**`readme.md`**、**`frontend-backend-contract.md`** §5、**`changelog.md`**）同步。
4. **请求层**：**`http.ts`** 错误分类与 **`useQuery`** 错误态可与上并行（见 **`frontend-study-plan.mdc`** 阶段 3）。

---

## 提交前约定（仅文档）

> 当你说「准备提交代码 / 提交代码」且**本意是更新学习记录**时，可默认只提交文档，避免与业务源码大 diff 混在一起。

### 建议纳入的文档范围

- 根目录 **`readme.md`**
- **`docs/documentation-index.md`**、**`docs/changelog.md`**、**`docs/study-progress.md`**、**`docs/frontend-backend-contract.md`**、**`docs/frontend-refactor-plan.md`**、**`docs/product-roadmap.md`**、**`docs/collaboration-and-coding-rules.md`**
- **`.cursor/rules/frontend-project-goal.mdc`**、**`frontend-study-plan.mdc`**、**`react-learning-checklist.mdc`**

### 每次文档提交前

1. 更新 **`readme.md`** 中「功能模块与实现程度」表（若代码有变）。
2. 更新本文件「最近一次学习 / 下一次起点」；有重大结构变更时追加 **`changelog.md`**。
3. 视情况勾选 **`react-learning-checklist.mdc`**。

---

## 教学风格（摘要）

- 用户有 Vue 背景、初学 React：助手以「Vue → React」对照讲解；**默认引导用户亲手改 `src/`**，除非用户明确授权代改（详见 **`frontend-project-goal.mdc`**）。
