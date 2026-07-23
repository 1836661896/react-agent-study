# Ant Design API 备忘（本仓库）

> **用途**：记录本项目已踩到的 **弃用 / 易混 API**，避免教学与联调时重复踩坑。  
> **当前依赖**：`antd` **^6.3.x**（以根目录 **`package.json`** 为准）。  
> **维护**：遇到 `@deprecated`、控制台弃用警告、或官方 changelog 变更时**追加一行**；不要把完整 antd 文档抄进本文件。

---

## 使用约定

1. 写 UI 前若用到下列组件，先扫一眼本表。  
2. TypeScript 悬停出现 `@deprecated` → **改用替代 prop**，并在本表补一条。  
3. 权威仍以 [Ant Design 文档](https://ant.design/components/overview-cn) 与本地 `node_modules/antd/.../*.d.ts` 为准；本表只记**本仓库踩过的**。

---

## 弃用 / 易错对照

| 组件 | 勿用（弃用或易错） | 改用 | 备注 | 记入 |
|------|-------------------|------|------|------|
| **Alert** | `message` | **`title`** | antd 6：`AlertProps.message` 已标 `@deprecated`，请用 `title`。`description` 仍可用。勿与全局 **`message.success/error`**（反馈 API）混淆。 | 2026-07-23 |
| **Spin** | `tip` | **`description`** | antd **6.3.0+**：自定义加载文案用 `description`。另：`wrapperClassName` → `classNames.root`；`size="default"` → `size="medium"`。 | 2026-07-23 |

---

## 易混但不弃用（备忘）

| 名称 | 说明 |
|------|------|
| **`message`（静态方法）** | `import { message } from "antd"` → `message.error(...)`，用于轻提示；**不是** `Alert` 的 `message` prop。 |
| **`Modal.confirm`** | 静态确认框；`onOk` 若需等异步结束再关，优先返回 Promise（如 `mutateAsync`）。 |

---

## 追加模板（复制一行到上表）

```text
| 组件名 | 旧写法 | 新写法 | 一句话原因 | YYYY-MM-DD |
```

---

*建立：2026-07-23（Alert `message` → `title`）。*  
*更新：2026-07-23 — Spin `tip` → `description`。*
