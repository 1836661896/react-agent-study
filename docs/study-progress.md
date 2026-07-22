# 学习进度与文档提交约定

> **学习节奏与「下一步」**；**不替代**根目录 **`readme.md`** 中的功能模块表。

---

## 最近一次学习（2026-07-22 · W7 收尾 + 附件体验打磨）

- **W6～W7**：tool 抽屉 ③④；附件 UI ①～④（antd composer；上传 / **粘贴任意文件**；`attachment_ids`；历史图预览 + 非图文件名；下载）。
- **打磨**：`exactOptionalPropertyTypes` 条件组 body；发送前 revoke 预览；切换会话 `useEffect` 清空 pending/tool；`is_error` class；`pages/chat/index.scss` 按展示顺序重排。
- **已知不做（暂）**：粘贴时「文字 + 文件」同时保留（有文件则 `preventDefault`，只上传文件）；前端大小上限暂 `10MB`（未强制对齐后端 `ARTIFACT_MAX_BYTES` 默认值）。
- **下一步**：主路径验收，或 **W8**（画像 / Abort）。

---

## 换设备继续（下一步）

1. 拉最新 **`main`**。
2. 打开 **`docs/frontend-refactor-plan.md`** §**W8**（或验收清单）。
3. 可选：**W8** Abort / 画像；确认约定单独回 **`1`**。

---

## 提交前约定

1. 有代码时建议 **`npm run lint`**。
2. 更新 **`readme.md`** 功能表、**`changelog.md`**、勾选 **`frontend-refactor-plan.md`**。
3. 教学默认不工具改 **`src/**`**，除非消息含 **`本次允许修改`**。
