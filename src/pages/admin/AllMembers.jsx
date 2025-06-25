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

const AllMembers = () => {
  const [view, setView] = useState("list"); {/* list, view, edit, add */ }

  return (
    <div className='flex flex-col'>
      <TopNav />

      {/* seen in default view */}
      {view === "list" && (<MembersList setView={setView} />)}

      {/* seen in default view then goes away when add member or view details or edit details is clicked */}
      {view === "list" && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild><Button className="size-12 rounded-full text-3xl font-normal fixed bottom-30 right-5 bg-blue-button">+</Button></DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="top" className="mb-2">
            <DropdownMenuItem onClick={() => setView("add")}><FaPlus />Add Member</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem><TbCancel />Cancel</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* seen in view details/edit details/add member */}
      {(view === "view" || view === "edit" || view === "add") && <MemberForms view={view} setView={setView} />}
    </div>
  )
}

export default AllMembers