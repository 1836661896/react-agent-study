import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [healthStatus, setHealthStatus] = useState(null)

  useEffect(() => {
    fetch('http://127.0.0.1:8000/health')
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'ok') setHealthStatus('ok')
        else setHealthStatus('error')
      })
      .catch(() => setHealthStatus('error'))
  }, [])

  return (
    <main className="app">
      <h1>Agent 前端</h1>
      <p className="health">
        后端状态：
        {healthStatus === null && '检查中…'}
        {healthStatus === 'ok' && '正常'}
        {healthStatus === 'error' && '异常或未启动'}
      </p>
    </main>
  )
}

export default App
