import React from "react";
import { Route, Routes } from "react-router-dom";
import AllMembers from "./pages/admin/AllMembers";
import MemberForms from "./pages/admin/MemberForms";
import Dues from "./pages/admin/Dues";
import Certification from "./pages/admin/Certification";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import AddMember from "./pages/admin/AddMember";
import MemberLayout from "./layouts/MemberLayout";
import SelectView from "./pages/SelectView";
import ProtectedRoute from "./layouts/ProtectedRoute";
import SearchMember from "./pages/admin/SearchMember";
import MonthlyDues from "./pages/admin/MonthlyDues";

const App = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/select" element={<SelectView />} />

      {/* Admin-only routes */}
      <Route element={<ProtectedRoute adminOnly={true} />}>
        <Route path="/members" element={<AllMembers />} />
        <Route path="/members/add" element={<AddMember />} />
        <Route path="/members/:id" element={<MemberForms view="view" />} />
        <Route path="/members/:id/edit" element={<MemberForms view="edit" />} />
        <Route path="/searchMemberDues" element={<SearchMember purpose={"dues"} />} />
        <Route path="/searchMemberCert" element={<SearchMember purpose={"certification"} />} />
        <Route path="/dues/:id/:name" element={<Dues />} />
        <Route path="/monthlyDuesReport/" element={<MonthlyDues />} />
        <Route path="/certification/:id" element={<Certification />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* Member-only routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/memberView/*" element={<MemberLayout />} />
      </Route>
    </Routes>
  );
};

export default App;
