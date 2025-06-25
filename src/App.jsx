import React from "react"
import { Route, Routes } from "react-router-dom";
import AllMembers from "./pages/admin/AllMembers";
import Dues from "./pages/admin/Dues";

const App = () => {
  return (
    <Routes>
      <Route path="/members" element={<AllMembers />} />
      <Route path="/dues" element={<Dues />} />
    </Routes>
  )
}

export default App