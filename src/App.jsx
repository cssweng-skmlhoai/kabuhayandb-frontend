import React from "react"
import { Route, Routes } from "react-router-dom";
import AllMembers from "./pages/admin/AllMembers";
import MemberForms from "./pages/admin/MemberForms";
import Dues from "./pages/admin/Dues";
import Certificate from "./pages/admin/Certificate";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import AddMember from "./pages/admin/AddMember";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/members" element={<AllMembers />} />
      <Route path="/members/add" element={<AddMember />} />
      <Route path="/members/:id" element={<MemberForms view="view" />} />
      <Route path="/members/:id/edit" element={<MemberForms view="edit" />} />
      <Route path="/dues" element={<Dues />} />
      <Route path="/certification" element={<Certificate />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  )
}

export default App