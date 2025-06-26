import React from 'react'
import { Routes, Route } from 'react-router-dom'
import MemberNavbar from '../components/MemberCompts/MemberNavbar'
import HHMembers from '../pages/member/HHMembers'
import HousingUtilities from '../pages/member/HousingUtilities'
import MemberDues from '@/pages/member/MemberDues'

const MemberLayout = () => {
  return (
    <>
      <MemberNavbar />
      <Routes>
        <Route path="/" element={<HHMembers />} />
        <Route path="housing-utilities" element={<HousingUtilities />} />
        <Route path="dues" element={<MemberDues />} />
        {/* Path for settings */}
      </Routes>
    </>
  )
}

export default MemberLayout