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
import { toast } from "sonner";

const MemberLayout = () => {
  const [member, setMember] = useState([]);
  const { memberId } = useAuthStore();

  const API_SECRET = import.meta.env.VITE_API_SECRET;
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    axios
      .get(`${API_URL}/members/${memberId}`, {
        headers: {
          Authorization: `Bearer ${API_SECRET}`,
        },
      })
      .then((res) => {
        setMember(res.data);
      })
      .catch((err) =>
        toast.error(err.response?.data?.error || "Something went wrong")
      );
  }, [API_SECRET, memberId]);

  return (
    <>
      <MemberNavbar member={member || {}} />
      <Routes>
        <Route path="" element={<HHMembers view="view" />} />
        <Route path="edit" element={<HHMembers view="edit" />} />
        <Route
          path="housing-utilities"
          element={<HousingUtilities view="view" />}
        />
        <Route
          path="housing-utilities/edit"
          element={<HousingUtilities view="edit" />}
        />
        <Route path="dues" element={<MemberDues />} />
        <Route path="settings" element={<Settings />} />
      </Routes>
    </>
  );
};

export default MemberLayout;
