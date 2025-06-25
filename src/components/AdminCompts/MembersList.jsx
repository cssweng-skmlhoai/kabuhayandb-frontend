import React from 'react';
import { IoSearchOutline } from "react-icons/io5";
import { IoFilterOutline } from "react-icons/io5";
import { TbArrowsSort } from "react-icons/tb";
import { LiaFileDownloadSolid } from "react-icons/lia";
import { BsThreeDots } from "react-icons/bs";
import { IoIosList } from "react-icons/io";
import { LuPencil } from "react-icons/lu";
import { TiDeleteOutline } from "react-icons/ti";
import { TbCancel } from "react-icons/tb";
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const MembersList = ({ setView }) => {
  return (
    <div>
      <div className='p-5 bg-customgray1 flex flex-col items-center justify-center gap-4'>
        <div className="relative w-[80%]">
          <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 cursor-pointer size-5" />
          <input type="text" placeholder="Search Member Name" className="border border-gray-300 rounded-md pl-10 pr-3 py-3 w-full bg-white"
          />
        </div>
        <div className='flex justify-around w-[80%]'>
          <Button className='rounded-sm bg-white border-1 border-black w-[30%] hover:bg-gray-300 text-customgray3 cursor-pointer'>
            <IoFilterOutline className='size-5' />
            <p className='font-poppins'>Filter</p>
          </Button>

          <Button className='rounded-sm bg-white border-1 border-black w-[30%] hover:bg-gray-300 text-customgray3 cursor-pointer'>
            <TbArrowsSort className='size-5' />
            <p className='font-poppins'>Sort</p>
          </Button>

          <Button className='rounded-sm bg-white border-1 border-black w-[30%] hover:bg-gray-300 text-customgray3 cursor-pointer'>
            <LiaFileDownloadSolid className='size-5' />
            <p className='font-poppins'>Export</p>
          </Button>
        </div>
      </div>

      {/* seen in default view */}
      <div className='px-8 py-6'>
        <div className='bg-customgray2 px-4 pb-4 pt-3 flex flex-col'>
          <div className='flex justify-end'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className='cursor-pointer'>
                  <BsThreeDots className='size-6' />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setView("view")}><IoIosList />View Details</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setView("edit")}><LuPencil />Edit Details</DropdownMenuItem>
                <DropdownMenuItem><TiDeleteOutline />Delete Member</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem><TbCancel />Cancel</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className='flex justify-between items-center font-poppins'>
            <div className='flex flex-col'>
              <p className='font-semibold'>Member Name</p>
              <div>
                <p>013 - 3017002676</p>
                <p>BLK 00 LOT 00</p>
              </div>
            </div>
            <p className='px-3 py-0.5 bg-white rounded-md mr-[8%]'>POSITION</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MembersList