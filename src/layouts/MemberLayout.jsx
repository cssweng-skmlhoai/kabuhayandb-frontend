import React from 'react'
import { useEffect, useState } from 'react';
import { Routes, Route, useParams } from 'react-router-dom'
import MemberNavbar from '../components/MemberCompts/MemberNavbar'
import HHMembers from '../pages/member/HHMembers'
import HousingUtilities from '../pages/member/HousingUtilities'
import MemberDues from '@/pages/member/MemberDues'
import axios from 'axios';

const MemberLayout = () => {
  const [member, setMember] = useState([]);
  //const member_id = 1; //hardcoded for testing
  const { id } = useParams(); 

  const API_SECRET = import.meta.env.VITE_API_SECRET;
  const API_URL = "https://kabuhayandb-backend.onrender.com";

  useEffect(() => {
    axios
      .get(`${API_URL}/members/${member_id}`, {
        headers: {
          Authorization: `Bearer ${API_SECRET}`,
        },
      }).then((res) => {
        setMember(res.data);
      }).catch(err => 
          console.log(err))
  }, []);

  return (
    <>
      <MemberNavbar member={member} />
      <Routes>
        <Route path=":id" element={<HHMembers view="view" />} />
        <Route path=":id/edit" element={<HHMembers view="edit" />} />
        <Route path=":id/housing-utilities" element={<HousingUtilities view="view"/>} />
        <Route path=":id/housing-utilities/edit" element={<HousingUtilities view="edit"/>} />
        <Route path="dues" element={<MemberDues />} />
        {/* Path for settings */}
      </Routes>
    </>
  )
}

export default MemberLayout