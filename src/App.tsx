import "@/styles/App.scss"
import { Link, Route, Routes } from "react-router-dom"
import HealthBage from "./components/HealthBage"
import { ROUTES } from "./constants/routes"
import ChatPage from "./pages/chat"
import HomePage from "./pages/HomePage"
import NotFoundPage from "./pages/NotFoundPage"

export default function App() {
  return (
    <div className="app-root">
      <header className="app-root__header">
        <div className="app-root__header-content">
          <strong>Agent 前端</strong>
          <Link to={ROUTES.home}>首页</Link>
          <Link to={ROUTES.chat}>聊天</Link>
          <HealthBage />
        </div>
      </header>
      <main className="app-root__content">
        <Routes>
          <Route path={ROUTES.home} element={<HomePage />} />
          <Route path={ROUTES.chat} element={<ChatPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  )
}
