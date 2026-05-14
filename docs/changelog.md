# 变更流水（文档与工程）

> 偏「历史追溯」；**当前功能与架构**以根目录 **`readme.md`** 为准。

---

## 2026-05-14

- **前端重构计划**：新增 **`docs/frontend-refactor-plan.md`**，作为与 **`myproject/backend`** 对齐的**重新开始**的执行清单（布局、API、组件、清理、验收）；**`readme.md`** 文首、**`documentation-index.md`**、**`study-progress.md`** 已指向该文件。
- **文档体系**：新增 **`docs/documentation-index.md`**（文档索引）、**`docs/study-progress.md`**（学习进度与文档提交约定）、**`docs/frontend-backend-contract.md`**（前后端契约）、**`docs/product-roadmap.md`**（产品构想）。根目录 **`readme.md`** 改为与 **`myproject/backend/readme.md`** 类似的分工：只保留定位、架构摘要、功能实现表、环境与极简 API 备忘，其余拆至 `docs/`。
- **协作规则**：新增 **`docs/collaboration-and-coding-rules.md`**；**`frontend-project-goal.mdc`** 与 **`myproject/backend/.cursor/rules/python-learning-agent.mdc`** 对齐——允许直接维护 **`readme.md`** / **`docs/*.md`** / **`.cursor/rules/`**；**`src/**`** 与 **`index.html`** 仅当用户正文含**一字不差**的 **`本次允许修改`** 六字时方可工具修改；**`package.json`**、**`vite.config.*`** 等配置类文件不得工具修改（仅口述）。
- **契约对齐**：现行联调以 **`myproject/backend`** 已挂载路由为准（`/health`、`/chat/stream`、`/conversation/*`）；旧 `/tasks`、`/agent/*`、非流式 `/chat`、`/events` 等在前端代码中仍为**遗留**，待重构移除或替换。
- **重构 §1（2026-05-14）**：完成 **`frontend-refactor-plan.md`** 之 **1.2** 复核；**`frontend-backend-contract.md`** §5 补充 **`done`/`onDone`** 与后端契约差异；**1.1** 待后端启动后本地确认 **`HealthHeader`**。
- **重构策略（2026-05-14）**：改为**移除整个 `src/` 后完全重写**；**`frontend-refactor-plan.md`** 改为以 **§R** 为主路径；**`readme.md`**、**`study-progress.md`**、**`frontend-backend-contract.md`** §5 已标注策略与历史快照说明。
