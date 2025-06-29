import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import { IoIosArrowRoundBack } from 'react-icons/io'
import { Link } from 'react-router-dom';
import { LuEye } from 'react-icons/lu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog"

const Settings = () => {
  const [option, setOption] = useState("username");
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className='font-poppins'>
      <div className='px-8 py-10'>
        <Link to="/members" className='cursor-pointer px-3 rounded-md flex items-center gap-2'>
          <IoIosArrowRoundBack className='size-10' />
          <p className='font-poppins text-lg'>Back</p>
        </Link>
      </div>

      <div className='px-9 pb-10 flex flex-col gap-10 xl:flex-row'>
        <div className='flex flex-col gap-8 xl:flex-1 xl:mt-20 xl:gap-10'>
          <p className='text-center font-semibold text-lg'>Account Settings</p>
          <div className='flex flex-col gap-2 xl:gap-7'>
            <Button className="bg-white hover:bg-gray-300 text-black border border-black text-md !p-2 !h-auto xl:!p-3" onClick={() => setOption("username")}>Change Username</Button>
            <Button className="bg-white hover:bg-gray-300 text-black border border-black text-md !p-2 !h-auto xl:!p-3" onClick={() => setOption("password")}>Change Password</Button>
          </div>
        </div>

        <div className='border border-black rounded-xl p-7 flex flex-col gap-20 min-h-lvh xl:flex-4/7'>
          <Button className="w-2/5 self-end bg-blue-button xl:w-1/5" onClick={() => setDialogOpen(true)}>Save</Button>
          {option === "username" && (
            <div className='flex flex-col gap-10 xl:px-7'>
              <p>Current Username: member01</p>
              <div className='flex flex-col gap-2'>
                <label htmlFor="username">New Username</label>
                <input className='border border-black p-2 rounded-md bg-customgray2' type="text" name="" id="" placeholder='Enter Your New Username' required />
                <p className='ml-3 text-red-500'>Error!</p>
              </div>
            </div>
          )}

          {option === "password" && (
            <div className='flex flex-col gap-10 xl:px-7'>
              <div className='flex flex-col gap-2'>
                <label htmlFor="currentpass">Current Password</label>
                <div className='relative'>
                  <input className='w-full border border-black p-2 pr-10 rounded-md bg-customgray2' type="text" name="" id="" placeholder='Enter Your Current Password' required />

                  <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600">
                    <LuEye className='size-5' />
                  </button>
                </div>
                <p className='ml-3 text-red-500'>Error!</p>
              </div>

              <div className='flex flex-col gap-2'>
                <label htmlFor="newpass">New Password</label>
                <div className='relative'>
                  <input className='w-full border border-black p-2 pr-10 rounded-md bg-customgray2' type="text" name="" id="" placeholder='Enter Your New Password' required />

                  <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600">
                    <LuEye className='size-5' />
                  </button>
                </div>
                <p className='ml-3 text-red-500'>Error!</p>
              </div>

              <div className='flex flex-col gap-2'>
                <label htmlFor="confirmpass">Confirm New Password</label>
                <div className='relative'>
                  <input className='w-full border border-black p-2 pr-10 rounded-md bg-customgray2' type="text" name="" id="" placeholder='Enter Your New Password Again' required />

                  <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600">
                    <LuEye className='size-5' />
                  </button>
                </div>
                <p className='ml-3 text-red-500'>Error!</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dialog for username/password change */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="w-[70%]">
          <p className='pt-10 pb-3 text-center font-medium text-lg'>Your Username Has Been Updated!</p>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Settings