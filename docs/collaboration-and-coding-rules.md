# 协作方式与编码约定（摘要）

> **用途**：给人看的**一页纸摘要**；**对 Cursor 助手的硬约束**以 **`.cursor/rules/study-project-goal.mdc`**（及其中「文件修改与操作原则」）为准。  
> **维护**：当 `.cursor/rules` 中规则变更时，同步检查本摘要是否矛盾。  
> **与后端对齐**：**`myproject/backend`** 仓库内对应文件为 **`docs/collaboration-and-coding-rules.md`**，约束逻辑与本文件一致（仅路径与文件类型按前端仓库映射）。

---

## 1. 助手与代码修改（教学项目约定）

- **默认**：助手**不直接修改** **`src/**`**、根目录 **`index.html`**；以**讲解 + 可复制片段**为主。用户声明「不要直接修改代码」时，**不使用**写入类工具。**唯一例外**：同条消息正文含**一字不差**的 **`本次允许修改`** 且用户写清代改范围（**「你直接改」等不算**）。细则：**`study-project-goal.mdc`**。  
- **以下文件助手不得直接修改**（仅口述步骤，由用户自行保存）：**`package.json`**、**`package-lock.json`**、**`vite.config.*`**、**`tsconfig*.json`**、**`eslint.config.*`**、**`.env.*`** 等工程与依赖配置（与后端规则中 **`.sh` / `requirements.txt`** 同类）。  
- **助手可直接维护的路径**（以规则文件最新版为准）：**`.cursor/rules/`**、根目录 **`readme.md`**、**`docs/`** 下与项目说明相关的 **`.md`** 文档。

---

## 2. 对话与教学语言

- **中文**为主；英文术语先给中文释义。  
- **节奏**：分步推进；复杂步骤等用户确认后再继续（详见 **`study-project-goal.mdc`**）。  
- **完整重写期间**（2026-07 起）：严格按 **①DOM → ②CSS → ③组件引用 → ④JS 逻辑**；**禁止**一次给出整页/整 hook 完整实现（权威：**`study-rewrite-pedagogy.mdc`**）。

---

## 3. 编码与工程习惯（摘要）

- **改动范围**：优先最小必要改动，避免无关重构。  
- **风格**：与现有 `src/` 中同目录代码保持一致（命名、分层、组件拆分习惯）。  
- **联调**：以前端 **`docs/frontend-backend-contract.md`** 与 **`myproject/backend/readme.md`** 为准。  
- **提交前**：更新 **`readme.md`**（当前模块状态）、**`docs/changelog.md`**（本条变更）；规划类文档按 **`documentation-index.md`** 分工。
- **架构与分层**：目录职责见 **`coding-architecture.mdc`**；import 见 **`coding-imports.mdc`**；api/SSE 边界见 **`coding-api-request.mdc`**。
- **务实边界**：不为拆行而拆、共享 vs 页面私有见 **`coding-pragmatic-structure.mdc`**。
- **接口异常**：先确认返回值再改代码，见 **`coding-data-investigation.mdc`**。
- **路径大小写（Windows）**：本仓库约定 **区分大小写**。克隆后请执行 **`git config core.ignorecase false`**（仅本仓库；该配置在 `.git/config`，**无法随仓库提交**）。编辑器侧已设 **`files.useCaseSensitiveFileNames: on`**（**`.vscode/settings.json`**）。仅改文件名大小写时仍建议两步 **`git mv`**。推荐在 **`tsconfig.json`** 打开 **`forceConsistentCasingInFileNames`: true**（由本地维护，助手默认不改该文件）。

---

## 4. 权威规则文件索引（`.cursor/rules`）

### 教学与协作（`study-*`）

| 文件 | 作用 |
|------|------|
| **`study-project-goal.mdc`** | 导师角色、能否改代码、教学节奏、`readme`/`docs` 维护范围、后端 API 摘要 |
| **`study-plan.mdc`** | 学习阶段（§W）、当前建议步骤 |
| **`study-learning-checklist.mdc`** | React 知识点勾选与后端联调摘要 |
| **`study-rewrite-pedagogy.mdc`** | 完整重写教学：DOM→CSS→引用→逻辑；禁止整页完整代码 |

### 架构与编码（`coding-*`，自 youbomao_PC 适配）

| 文件 | 作用 |
|------|------|
| **`coding-architecture.mdc`** | 单应用目录、分层职责、`api` / `pages` / `types` 边界 |
| **`coding-imports.mdc`** | `@/` 别名、禁止深层 `../`、import type |
| **`coding-comments.mdc`** | 中文注释与 JSDoc |
| **`coding-api-request.mdc`** | `request()` JSON 信封 vs `chatStream` SSE；api 层无副作用 |
| **`coding-react-components.mdc`** | 组件结构、Query Key、文件拆分 |
| **`coding-styling.mdc`** | SCSS 惯例与 Ant Design Token |
| **`coding-eslint-quality.mdc`** | ESLint + Biome、常量与质量倾向 |
| **`coding-documentation.mdc`** | README / docs / rules 分工 |
| **`coding-pragmatic-structure.mdc`** | 何时拆文件、共享组件、死代码清理 |
| **`coding-data-investigation.mdc`** | 接口问题先确认再改 |

### 执行清单（`docs/`）

| 文件 | 作用 |
|------|------|
| **`docs/frontend-refactor-plan.md`** | 完整重写 **§W** 执行清单（勾选推进） |

*修订：2026-07-20 增加 `study-rewrite-pedagogy.mdc`；清单切 §W。*
