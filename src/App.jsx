import React from "react"
import { Route, Routes, Navigate, useParams } from "react-router-dom";
import AllMembers from "./pages/admin/AllMembers";
import MemberForms from "./pages/admin/MemberForms";
import Dues from "./pages/admin/Dues";
import Certificate from "./pages/admin/Certificate";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import AddMember from "./pages/admin/AddMember";
import MemberLayout from './layouts/MemberLayout';
import SelectView from "./pages/SelectView";

const App = () => {
  const id = 1; // hardcoded for testing
  // const { id } = useParams();

  return (
    <Routes>
      {/* to select view */}
      <Route path="/select" element={<SelectView />} />

      {/* admin view routes can see all members */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/members" element={<AllMembers />} />
      <Route path="/members/add" element={<AddMember />} />
      <Route path="/members/:id" element={<MemberForms view="view" />} />
      <Route path="/members/:id/edit" element={<MemberForms view="edit" />} />
      <Route path="/dues" element={<Dues />} />
      <Route path="/certification" element={<Certificate />} />
      <Route path="/settings" element={<Settings />} />

      {/* member view routes can only see personal details (based on ID) */}
      <Route path="/memberViews" element={<Navigate to={`/memberView/${id}`} replace />} />
      <Route path="/memberView/*" element={<MemberLayout />} />
    </Routes>
  )
}

export default App