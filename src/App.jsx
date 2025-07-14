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

const App = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/select" element={<SelectView />} />

      {/* Admin-only routes */}
      <Route>
        <Route path="/members" element={<AllMembers />} />
        <Route path="/members/add" element={<AddMember />} />
        <Route path="/members/:id" element={<MemberForms view="view" />} />
        <Route path="/members/:id/edit" element={<MemberForms view="edit" />} />
        <Route path="/searchMemberDues" element={<SearchMember purpose={"dues"} />} />
        <Route path="/searchMemberCert" element={<SearchMember purpose={"certification"} />} />
        <Route path="/dues/:id" element={<Dues />} />
        <Route path="/certification/:id" element={<Certification />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* Member-only routes */}
      <Route>
        <Route path="/memberView/*" element={<MemberLayout />} />
        {/* Optional redirect to auto-navigate to /memberView/:id */}
        {/* <Route path="/memberViews" element={<NavigateToMemberView />} /> */}
      </Route>
    </Routes>
  );
};

export default App;
