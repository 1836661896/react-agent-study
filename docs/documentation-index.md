# 文档体系索引（各文件职责）

> **用途**：说明本仓库内「说明类文档」谁负责记什么、何时更新，避免根目录 **`readme.md`** 与 **`docs/`** 分工不清。  
> **维护**：文档体系本身变更时，更新**本文件** + 根目录 **`readme.md`** 文首引用。

---

## 总览表

| 序号 | 文件路径 | 核心作用 | 典型更新时机 |
|------|-----------|-----------|----------------|
| 1 | **`readme.md`**（仓库根） | **当前真相**：定位、路径约定、**`src/` 目录与架构摘要**、**功能模块与实现程度表**、环境与启动、API 备忘（极简 + 指向专题）；文首指向其余文档 | **随代码或联调契约变更实时同步** |
| 2 | **`docs/documentation-index.md`** | **本索引**：各文档职责与更新时机 | 增删重命名 `docs/` 下说明文件时 |
| 3 | **`docs/changelog.md`** | **变更流水**：文档结构、依赖、对外行为等按日期的记录 | 有值得追溯的变更时追加条目 |
| 4 | **`docs/study-progress.md`** | **学习进度**：最近一次学习摘要、下一步、**仅文档提交**时的约定 | 阶段推进、学习记录、提交流程变化时 |
| 5 | **`docs/frontend-backend-contract.md`** | **前后端契约**：现行/已下线接口、JSON 信封与 SSE、与 **`myproject/backend`** 文档的对应关系 | 后端路由变更或前端 `src/api` 调整时 |
| 6 | **`docs/frontend-refactor-plan.md`** | **完整重写执行清单 §W**：空壳→契约→布局→列表/SSE→附件→可选增强 | 每完成一个 W 阶段或调整范围时 |
| 7 | **`docs/product-roadmap.md`** | **产品对齐**：聊天为主、快捷入口、左侧栏等**构想与排期**，不替代代码真相 | 产品方向讨论有结论时 |
| 8 | **`docs/antd-api-notes.md`** | **Ant Design 弃用/易混 API**（本仓库踩坑表）；当前 antd 6 | 遇到 `@deprecated` 或组件 API 变更时追加 |
| 9 | **`docs/collaboration-and-coding-rules.md`** | **人类可读**的协作与编码约定摘要；**指向** `.cursor/rules` 中权威规则 | 与 **`study-project-goal.mdc`** 同步补充 |
| 10 | **`.cursor/rules/study-project-goal.mdc`** | 助手行为、**文件修改与操作原则**、项目目标、**现行后端 API 列表** | 规则或后端契约变化时 |
| 11 | **`.cursor/rules/study-plan.mdc`** | 学习阶段（§W）、当前建议步骤 | 阶段切换时 |
| 12 | **`.cursor/rules/study-learning-checklist.mdc`** | React 知识点勾选与后端联调摘要 | 清单状态或联调范围变化时 |
| 13 | **`.cursor/rules/study-rewrite-pedagogy.mdc`** | **完整重写教学节奏**：DOM→CSS→引用→逻辑；禁止一次给整页完整代码 | 教学方式变更时 |
| 14 | **`.cursor/rules/coding-*.mdc`** | **架构与编码**约定；索引见 **`collaboration-and-coding-rules.md` §4** | 分层、api、样式、质量规范变更时 |

---

## 与「学习仓库」相关的其他仓库（规范路径）

| 路径 | 作用 |
|------|------|
| **`myproject/backend`** | Python + FastAPI；**`readme.md`**、**`docs/chat-stream-api.md`**、**`docs/conversations-api.md`** 等为接口权威 |
| **`myproject/frontend`** | 本仓库在文档中的约定名（跨设备协作） |

---

## 编写约定（摘要）

1. **`readme.md`**：不写长篇学习叙事与重复 API 表；细节在 **`docs/frontend-backend-contract.md`** 等专题。  
2. **产品愿景**：大段构想放在 **`docs/product-roadmap.md`**；`readme` 的功能表只反映**当前代码真实落地程度**。  
3. **助手新对话**：按文首顺序阅读 **`readme.md`** → **`docs/documentation-index.md`** → **`docs/frontend-refactor-plan.md`**（§W）→ **`study-project-goal.mdc`** → **`study-rewrite-pedagogy.mdc`** → 编码相关 **`coding-architecture.mdc`** 等（见 **`collaboration-and-coding-rules.md` §4**）。

---

*建立：2026-05-14（与 `myproject/backend` 的 `docs/documentation-index.md` 分工方式对齐）。*  
*最近：**2026-07-23** 增 **`antd-api-notes.md`**；**2026-07-20** 完整重写 + **`study-rewrite-pedagogy.mdc`**。*
