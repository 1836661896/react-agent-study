import { Layout, Space, Typography } from "antd"
import "./styles/App.scss"
import { Link, Route, Routes } from "react-router-dom"
import ChatPage from "./pages/chat/ChatPage"
import HomePage from "./pages/HomePage"
import NotFoundPage from "./pages/NotFoundPage"

const { Header, Content } = Layout

export default function App() {
  return (
    <Layout className="app-root">
      <Header className="app-root__header">
        <Space>
          <Typography.Text strong>Agent 前端</Typography.Text>
          <Link to="/">首页</Link>
          <Link to="/chat">聊天</Link>
        </Space>
      </Header>
      <Content className="app-root__content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Content>
    </Layout>
  )
}
