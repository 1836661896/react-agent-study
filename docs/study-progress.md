# 学习进度与文档提交约定

> **学习节奏与「下一步」**；**不替代**根目录 **`readme.md`** 中的功能模块表。

---

## 最近一次学习（2026-07-20 晚 · W0～W1 进行中）

- **W0**：旧实现整目录迁至 **`backup/src/`**；根目录 **`src/`** 从空壳重建。
- **W1 已完成**：①DOM 壳、②全局/App SCSS（含 `&__*` 嵌套）、③Router + 首页/聊天/404 占位、④a Provider（Query + antd 中文）。
- **W1 进行中**：④b 请求地基 — 已有 **`config/env.ts`**、**`types/common.ts`（仅信封）**、**`utils/url.ts`**；**尚未**重建 **`utils/request.ts`**、**`api/health`**、顶栏 **HealthBage**。
- **约定**：用户单独回复 **`1`** = 当前步完成（见 **`study-rewrite-pedagogy.mdc`**）。

---

## 换设备继续（下一步）

1. 拉最新 **`main`**；确认 **`backup/src/`** 在（旧代码对照，勿迁业务回 `src`）。
2. 打开 **`docs/frontend-refactor-plan.md`** §**W1** / **`docs/study-progress.md`**。
3. **直接从 W1-4b② 前补完**：若本机还缺 **`src/utils/request.ts`**，先按上次片段补全，再做 **`getHealth` + HealthBage 挂顶栏**。
4. 完成后勾选 W1，进入 **W2**（会话/流式/附件类型与 api；**`preset=guide`**、默认 **`routing=chat`**）。
5. **大小写**：`main.tsx` 当前 `import App from "./app"`；仓库历史文件名多为 **`App.tsx`**。Linux/CI 区分大小写时请统一为 **`./App`** + **`App.tsx`**。

---

## 提交前约定

1. 有代码时建议 **`npm run lint`**（本批以文档 + 空壳为主）。
2. 更新 **`readme.md`** 功能表、**`changelog.md`**、勾选 **`frontend-refactor-plan.md`**。
3. 教学默认不工具改 **`src/**`**，除非消息含 **`本次允许修改`**。
