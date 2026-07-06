import { useState } from 'react'
import './App.css'
import Dashboard from './pages/Dashboard'

function App() {
  const [user] = useState({
    name: 'Ava Chen',
    role: 'Security Operations Lead',
  })

  return <Dashboard user={user} onLogout={null} />
}

export default App
