import React, { useEffect } from 'react';
import { IoSearchOutline } from "react-icons/io5";
import { IoFilterOutline } from "react-icons/io5";
import { TbArrowsSort } from "react-icons/tb";
import { LiaFileDownloadSolid } from "react-icons/lia";
import { BsThreeDots } from "react-icons/bs";
import { IoIosList } from "react-icons/io";
import { LuPencil } from "react-icons/lu";
import { TiDeleteOutline } from "react-icons/ti";
import { TbCancel } from "react-icons/tb";
import { FaPlus } from 'react-icons/fa6';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog"
import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const MembersList = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [members, setMembers] = useState([]);
  const [searched, setSearched] = useState("");

  const API_SECRET = import.meta.env.VITE_API_SECRET;
  const API_URL = "https://kabuhayandb-backend.onrender.com";

  // fetch all members once
  useEffect(() => {
    axios.get(`${API_URL}/members/home`, {
      headers: {
        'Authorization': `Bearer ${API_SECRET}`
      }
    }).then(res => {
      if (!res.data) {
        setMembers([]);
      } else {
        setMembers(res.data);
      }
    }).catch(err => { console.log(err) })
  }, []);

  // function to search for user
  const searchUser = () => {
    axios.get(`${API_URL}/members/home?name=${searched}`, {
      headers: {
        'Authorization': `Bearer ${API_SECRET}`
      }
    }).then(res => {
      if (!res.data) {
        setMembers([]);
      } else {
        const results = Array.isArray(res.data) ? res.data : [res.data];
        setMembers(results);
      }
    }).catch(err => { console.log(err) })
  }

  return (
    <div>
      <div className='p-5 bg-customgray1 flex flex-col items-center justify-center gap-4 font-poppins xl:bg-white xl:flex-row xl:px-10 xl:pt-10 xl:pb-5'>
        <div className='hidden xl:flex justify-between w-full items-end'> {/* desktop only/separate component */}
          <div className='flex flex-col'>
            <p className='font-semibold text-3xl'>All Members</p>
            <p>View and Edit Member Details</p>
          </div>

          <div className='flex gap-3'>
            <Button className='rounded-sm bg-white border-1 border-black hover:bg-gray-300 text-customgray3 cursor-pointer'>
              <LiaFileDownloadSolid className='size-5' />
              <p>Export</p>
            </Button>

            <Button className="bg-blue-button" >
              <Link to="/members/add" className='flex items-center gap-2'><FaPlus />Add Member</Link>
            </Button>
          </div>
        </div>

        <div className="relative w-[80%] xl:hidden">
          <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 cursor-pointer size-5" onClick={searchUser} />
          <input type="text" placeholder="Search Member Name" className="border border-gray-300 rounded-md pl-10 pr-3 py-3 w-full bg-white" value={searched} onChange={(e) => setSearched(e.target.value)} />
        </div>
        <div className='flex justify-around w-[80%] xl:hidden'>
          <Button className='rounded-sm bg-white border-1 border-black w-[30%] hover:bg-gray-300 text-customgray3 cursor-pointer'>
            <IoFilterOutline className='size-5' />
            <p>Filter</p>
          </Button>

          <Button className='rounded-sm bg-white border-1 border-black w-[30%] hover:bg-gray-300 text-customgray3 cursor-pointer'>
            <TbArrowsSort className='size-5' />
            <p>Sort</p>
          </Button>

          <Button className='rounded-sm bg-white border-1 border-black w-[30%] hover:bg-gray-300 text-customgray3 cursor-pointer'>
            <LiaFileDownloadSolid className='size-5' />
            <p>Export</p>
          </Button>
        </div>
      </div>

      {/* seen in default view */}
      <div className='px-8 py-6 xl:border xl:border-black xl:mr-10 xl:mt-3 xl:ml-5 xl:mb-10 xl:rounded-lg xl:flex xl:flex-col xl:gap-7'>
        <div className='hidden xl:flex justify-between items-center'> {/* desktop only */}
          <div className='flex w-1/2 gap-3 items-center'>
            <div className='p-1 rounded-md bg-customgray1'>
              <Button className="rounded-e-none bg-customgray1 text-black hover:bg-gray-400">All</Button>
              <Button className="rounded-none bg-customgray1 text-black hover:bg-gray-400">Members</Button>
              <Button className="rounded-s-none bg-customgray1 text-black hover:bg-gray-400">Officers</Button>
            </div>
            <Button className='rounded-sm bg-white border-1 border-black w-[20%] hover:bg-gray-300 text-customgray3 cursor-pointer'>
              <IoFilterOutline className='size-5' />
              <p className='font-poppins'>Filter</p>
            </Button>
          </div>

          <div className='flex items-center w-1/2 justify-end gap-3'>
            <div className="relative w-1/2">
              <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 cursor-pointer size-5" onClick={searchUser} />
              <input type="text" placeholder="Search Member Name" className="border border-black rounded-md pl-10 pr-3 py-1.5 w-full bg-white" value={searched} onChange={(e) => setSearched(e.target.value)} />
            </div>

            <Button className='rounded-sm bg-white border-1 border-black w-[20%] hover:bg-gray-300 text-customgray3 cursor-pointer'>
              <TbArrowsSort className='size-5' />
              <p className='font-poppins'>Sort</p>
            </Button>
          </div>
        </div>

        {members.length === 0 ? (
          <p className="text-center text-gray-500 mt-4">No members found.</p>
        ) : (
          members.map(member => (
            <div key={member.member_id} className='bg-customgray2 px-4 pb-4 pt-3 flex flex-col xl:rounded-md xl:relative xl:py-5'>
              <div className='flex justify-end xl:absolute xl:right-4 xl:-translate-y-3'>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className='cursor-pointer'>
                      <BsThreeDots className='size-6 rounded hover:bg-gray-300' />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem >
                      <Link to={`/members/${member.member_id}`} className='flex items-center gap-2'>
                        <IoIosList />View Details
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link to={`/members/${member.member_id}/edit`} className='flex items-center gap-2'>
                        <LuPencil />Edit Details
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setDialogOpen(true)}>
                      <TiDeleteOutline />Delete Member
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem><TbCancel />Cancel</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className='flex justify-between items-center font-poppins'>
                <div className='flex items-center gap-4'>
                  <img src={member.imageUrl || "/path/to/default.jpg"} alt="Profile" className='hidden xl:block size-12 rounded-full bg-gray-300' />
                  <div className='flex flex-col gap-1.5'>
                    <p className='font-semibold'>{member.fullname}</p>
                    <div className='xl:flex gap-20'>
                      <p>{member.tct_no}</p>
                      <p>BLK {member.block_no} • LOT {member.lot_no}</p>
                    </div>
                  </div>
                </div>
                <p className='px-3 py-0.5 bg-white rounded-md mr-[8%] xl:mr-[12%]'>
                  {member.head_position || "N/A"}
                </p>
              </div>
            </div>
          ))
        )}


        <div className='hidden xl:flex justify-between'> {/* for pagination/desktop only */}
          <p>1 - 08 of 00</p>
          <div className='flex items-center gap-3'>
            <button className="border border-gray-400 rounded hover:bg-gray-400"><ChevronLeft /></button>
            <p>1/10</p>
            <button className="border border-gray-400 rounded hover:bg-gray-400"><ChevronRight /></button>
          </div>
        </div>
      </div>

      {/* Dialog for delete member confirmation */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="w-[70%]">
          <DialogHeader>
            <DialogTitle className="text-left">Delete Member?</DialogTitle>
            <DialogDescription className="flex flex-col gap-4">
              Are you sure you want to delete this member? This will permanently delete all records related to this member from the database.
              <div className='w-full flex justify-between'>
                <Button className="w-[45%] bg-red-500 hover:bg-red-700">Delete</Button>
                <DialogClose className="w-[45%]"><Button className="w-full">Cancel</Button></DialogClose>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

    </div>
  )
}

export default MembersList