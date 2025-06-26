import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom'
import MemberLayout from './layouts/MemberLayout'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/members" replace />} />
        <Route path="/members/*" element={<MemberLayout />} />
      </Routes>
    </Router>
  )
}

export default App