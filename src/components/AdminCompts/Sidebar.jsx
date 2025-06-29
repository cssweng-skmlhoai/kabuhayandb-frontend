import React from 'react'
import { useState } from 'react';
import { GoPeople, GoSidebarExpand, GoSidebarCollapse } from "react-icons/go";
import { PiWallet } from "react-icons/pi";
import { GrDocumentUser } from "react-icons/gr";
import { SlSettings } from "react-icons/sl";
import { MdOutlineLogout } from "react-icons/md";
import { Link } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div>
      <div className={`${isOpen ? "w-65" : "w-21"} hidden xl:flex flex-col bg-white text-customgray-3 transition-all duration-300 h-screen sticky top-0`}>
        <div className="flex items-center justify-between px-5 py-4">
          {isOpen && (
            <div className="flex items-center gap-2">
              <img src="/path/to/profile.jpg" alt="Profile" className="size-8 rounded-full" />
              <span className={`text-xl font-medium ml-2 overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out ${isOpen ? "opacity-100 w-auto translate-x-0" : "opacity-0 w-0 -translate-x-2"}`}>SKMLHOAI</span>
            </div>
          )}

          <button className="my-12 p-2 rounded hover:bg-gray-300 focus:outline-none transition-colors" onClick={toggleSidebar}>
            {isOpen ? <GoSidebarExpand size={24} /> : <GoSidebarCollapse size={24} />}
          </button>
        </div>

        <nav className="flex flex-col gap-2 px-5">
          <Link to="/members" className="flex items-center gap-2 hover:bg-gray-300 p-2 rounded">
            <div className="min-w-[24px] flex justify-center items-center">
              <GoPeople className='size-6' />
            </div>
            {isOpen && <span className={`ml-2 overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out ${isOpen ? "opacity-100 w-auto translate-x-0" : "opacity-0 w-0 -translate-x-2"}`}>Members</span>}
          </Link>
          <Link to="/dues" className="flex items-center gap-2 hover:bg-gray-300 p-2 rounded">
            <div className="min-w-[24px] flex justify-center items-center">
              <PiWallet className='size-6' />
            </div>
            {isOpen && <span className={`ml-2 overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out ${isOpen ? "opacity-100 w-auto translate-x-0" : "opacity-0 w-0 -translate-x-2"}`}>Dues</span>}
          </Link>
          <Link to="/certification" className="flex items-center gap-2 hover:bg-gray-300 p-2 rounded">
            <div className="min-w-[24px] flex justify-center items-center">
              <GrDocumentUser className='size-6' />
            </div>
            {isOpen && <span className={`ml-2 overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out ${isOpen ? "opacity-100 w-auto translate-x-0" : "opacity-0 w-0 -translate-x-2"}`}>Certification</span>}
          </Link>
        </nav>

        <div className="flex-1" />

        <nav className="flex flex-col gap-2 py-2 px-5 mb-4">
          <Link to="/settings" className="flex items-center gap-2 hover:bg-gray-300 p-2 rounded">
            <div className="min-w-[24px] flex justify-center items-center">
              <SlSettings className='size-6' />
            </div>
            {isOpen && <span className={`ml-2 overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out ${isOpen ? "opacity-100 w-auto translate-x-0" : "opacity-0 w-0 -translate-x-2"}`}>Settings</span>}
          </Link>
          <Dialog>
            <DialogTrigger className="flex items-center gap-2 hover:bg-gray-300 p-2 rounded">
              <div className="min-w-[24px] flex justify-center items-center">
                <MdOutlineLogout className='size-6' />
              </div>
              {isOpen && <span className={`ml-2 overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out ${isOpen ? "opacity-100 w-auto translate-x-0" : "opacity-0 w-0 -translate-x-2"}`}>Logout</span>}
            </DialogTrigger>
            <DialogContent className="w-[70%]">
              <DialogHeader>
                <DialogTitle className="text-left">Are you Sure You Want to Logout?</DialogTitle>
                <DialogDescription className="pt-5 flex justify-between">
                  <Link to="/login" className='w-[45%]'><Button className="w-full bg-red-500 hover:bg-red-700">Logout</Button></Link>
                  <DialogClose className="w-[45%]"><Button className="w-full">Cancel</Button></DialogClose>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </nav>
      </div>
    </div>
  )
}

export default Sidebar