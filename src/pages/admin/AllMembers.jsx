import React from 'react';
import TopNav from '@/components/AdminCompts/TopNav';
import { Button } from '@/components/ui/button';
import { TbCancel } from "react-icons/tb";
import { FaPlus } from "react-icons/fa6";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import MembersList from '@/components/AdminCompts/MembersList';
import Sidebar from '@/components/AdminCompts/Sidebar';
import { Link } from 'react-router-dom';

const AllMembers = () => {

  return (
    <div className="flex flex-col">
      <TopNav />

      <div className="flex flex-col xl:flex-row flex-1 relative">
        <Sidebar />

        <div className="flex-1 relative">
          <MembersList />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="size-12 rounded-full text-3xl font-normal fixed bottom-30 right-5 bg-blue-button xl:hidden">+</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="top" className="mb-2">
              <DropdownMenuItem><Link to="/members/add" className='flex items-center gap-2'><FaPlus />Add Member</Link></DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem><TbCancel />Cancel</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}

export default AllMembers