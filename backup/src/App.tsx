import { Layout, Space, Typography } from "antd"
import { Link, Route, Routes } from "react-router-dom"
import HealthBage from "@/components/HealthBage"
import { ROUTES } from "@/constants/routes"
import ChatPage from "@/pages/chat"
import HomePage from "@/pages/HomePage"
import NotFoundPage from "@/pages/NotFoundPage"
import "@/styles/App.scss"

const { Header, Content } = Layout

export default function App() {
  return (
    <Layout className="app-root">
      <Header className="app-root__header">
        <div className="app-root__header-content">
          <Space>
            <Typography.Text strong>Agent 前端</Typography.Text>
            <Link to={ROUTES.home}>首页</Link>
            <Link to={ROUTES.chat}>聊天</Link>
          </Space>
          <HealthBage />
        </div>
      </Header>
      <Content className="app-root__content">
        <Routes>
          <Route path={ROUTES.home} element={<HomePage />} />
          <Route path={ROUTES.chat} element={<ChatPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Content>
    </Layout>
  )
}
