import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom'
import { useParams } from "react-router-dom";
import MemberLayout from './layouts/MemberLayout'
import { Toaster } from "sonner";

const App = () => {
  const id = 3; //hardcoded for testing
  //const { id } = useParams(); 

  return (
    <>
    <Toaster 
      richColors 
      position="top-center" 
      toastOptions={{
        classNames: {
          toast: "text-base px-6 py-4 rounded-xl", 
          description: "text-sm mt-1", 
          actionButton: "text-sm px-4 py-2", 
          closeButton: "text-lg", 
        },    
    }}/>
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={`/members/${id}`} replace />} />
        <Route path="/members/*" element={<MemberLayout />} />
      </Routes>
    </Router>
    </>
  )
}

export default App