import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom'
import { useParams } from "react-router-dom";
import MemberLayout from './layouts/MemberLayout'

const App = () => {
  //const id = 1; //hardcoded for testing
  const { id } = useParams(); 

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={`/members/${id}`} replace />} />
        <Route path="/members/*" element={<MemberLayout />} />
      </Routes>
    </Router>
  )
}

export default App