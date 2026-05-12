import './App.scss'
import { Card, Col, Row, Space } from 'antd'


import HealthHeader from './components/HealthHeader'
import AgentCommand from './components/AgentCommand'
import AgentNlRun from './components/AgentNlRun'
import LastStep from "./components/LastStep"
import StepList from './components/StepList'
import TaskSection from './components/TaskSection'
import ChatPanel from './components/ChatPanel'
import EventTimeLine from './components/EventTimeLine'


function App() {
  return (
    <main className="app">
      <div className="app-header">
        <HealthHeader />
      </div>
      <Row className="app-main" gutter={[16, 16]}>
        <Col span={24} lg={16}>
          <div className="app-col-scroll scrollbar-hidden">
            <Space orientation="vertical" size="large" style={{ width: "100%" }}>
              <EventTimeLine />
              <AgentNlRun />
              <AgentCommand />
              <LastStep />
              <StepList />
              <TaskSection />
            </Space>
          </div>
        </Col>
        <Col span={24} lg={8}>
          <ChatPanel />
        </Col>
      </Row>
    </main>
  )
}

export default App
