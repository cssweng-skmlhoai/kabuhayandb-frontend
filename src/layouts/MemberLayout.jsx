import React from "react";
import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import MemberNavbar from "../components/MemberCompts/MemberNavbar";
import HHMembers from "../pages/member/HHMembers";
import HousingUtilities from "../pages/member/HousingUtilities";
import MemberDues from "@/pages/member/MemberDues";
import axios from "axios";
import useAuthStore from "@/authStore";
import Settings from "@/pages/Settings";

const MemberLayout = () => {
  const [member, setMember] = useState([]);
  const { member_id } = useAuthStore();

  const API_SECRET = import.meta.env.VITE_API_SECRET;
  const API_URL = "https://kabuhayandb-backend.onrender.com";

  useEffect(() => {
    axios
      .get(`${API_URL}/members/${member_id}`, {
        headers: {
          Authorization: `Bearer ${API_SECRET}`,
        },
      })
      .then((res) => {
        setMember(res.data);
      })
      .catch((err) => console.log(err));
  }, [API_SECRET, member_id]);

  return (
    <>
      <MemberNavbar member={member} />
      <Routes>
        <Route path=":id" element={<HHMembers view="view" />} />
        <Route path=":id/edit" element={<HHMembers view="edit" />} />
        <Route
          path=":id/housing-utilities"
          element={<HousingUtilities view="view" />}
        />
        <Route
          path=":id/housing-utilities/edit"
          element={<HousingUtilities view="edit" />}
        />
        <Route path="dues" element={<MemberDues />} />
        <Route path="settings" element={<Settings />} />
      </Routes>
    </>
  );
};

export default MemberLayout;
