import React from 'react';
import { useState } from 'react'
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
import MemberForms from '@/components/AdminCompts/MemberForms';
import Sidebar from '@/components/AdminCompts/Sidebar';

const AllMembers = () => {
  const [view, setView] = useState("list"); {/* list, view, edit, add */ }

  return (
    <div className="flex flex-col">
      <TopNav />

      <div className="flex flex-col xl:flex-row flex-1 relative">
        <Sidebar />

        <div className="flex-1 relative">
          {view === "list" && (<MembersList setView={setView} />)}

          {view === "list" && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="size-12 rounded-full text-3xl font-normal fixed bottom-30 right-5 bg-blue-button xl:hidden">+</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" side="top" className="mb-2">
                <DropdownMenuItem onClick={() => setView("add")}><FaPlus />Add Member</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem><TbCancel />Cancel</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {(view === "view" || view === "edit" || view === "add") && <MemberForms view={view} setView={setView} />}
        </div>
      </div>
    </div>
  )
}

export default AllMembers