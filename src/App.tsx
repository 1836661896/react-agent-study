import { Layout, Typography } from "antd"
import "./styles/App.scss"

const { Header, Content } = Layout

export default function App() {
  return (
    <Layout className="app-root">
      <Header className="app-root__header">Agent 前端</Header>
      <Content className="app-root__content">
        <Typography.Title level={4}>R2 骨架</Typography.Title>
        <Typography.Paragraph>
          下一步：按 docs/frontend-refactor-plan.md 做 R3（conversation + chatStream）与 R4（三栏 UI）。
        </Typography.Paragraph>
      </Content>
    </Layout>
  )
}