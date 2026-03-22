import './App.css'
import { Space } from 'antd'


import HealthHeader from './components/HealthHeader'
import AgentCommand from './components/AgentCommand'
import LastStep from "./components/LastStep"
import StepList from './components/StepList'
import TaskSection from './components/TaskSection'


function App() {



  return (
    <main className='app'>
      <Space orientation="vertical" size="large" style={{ width: "100%" }}>
        <HealthHeader />

        <AgentCommand />

        <LastStep />

        <StepList />

        <TaskSection />

      </Space>
    </main>
  )
}

export default App
