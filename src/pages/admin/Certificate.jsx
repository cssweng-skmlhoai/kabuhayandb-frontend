import TopNav from '@/components/AdminCompts/TopNav';
import { Button } from '@/components/ui/button';
import React from 'react'
import { IoSearchOutline } from 'react-icons/io5';

const Certificate = () => {
  return (
    <div>
      <TopNav />

      <div>
        <div className="relative w-[80%]">
          <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 cursor-pointer size-5" />
          <input type="text" placeholder="Search Member Name" className="border border-gray-300 rounded-md pl-10 pr-3 py-3 w-full bg-white"
          />
        </div>
      </div>

      <div>

      </div>

      <div>
        <Button>Save</Button>
        <Button>Print</Button>
      </div>
    </div>
  )
}

export default Certificate