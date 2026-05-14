import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ConfigProvider } from "antd"
import zhCN from "antd/locale/zh_CN"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App"
import "./styles/main.scss"
import { BrowserRouter } from "react-router-dom"

const queryClient = new QueryClient()

const rootEl = document.getElementById("root")
if (!rootEl) {
  throw new Error("找不到 #root")
}

createRoot(rootEl).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider locale={zhCN}>
          <App />
        </ConfigProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
)
