import React from 'react';
import { GoPeople } from "react-icons/go";
import { PiWallet } from "react-icons/pi";
import { GrDocumentUser } from "react-icons/gr";
import { SlSettings } from "react-icons/sl";
import { MdOutlineLogout } from "react-icons/md";
import { Link } from 'react-router-dom';

const TopNav = () => {
  return (
    <div className='xl:hidden'>
      <nav className='p-3 mt-5'>
        <ul className='flex justify-around items-center'>
          <li>
            <Link to="/members">
              <div className='flex flex-col items-center justify-center hover:bg-gray-300 p-1 rounded-sm cursor-pointer'>
                <GoPeople className='size-6' />
                <p className='font-poppins text-sm'>Members</p>
              </div>
            </Link>
          </li>
          <li>
            <Link to="/dues">
              <div className='flex flex-col items-center justify-center hover:bg-gray-300 p-1 rounded-sm cursor-pointer'>
                <PiWallet className='size-6' />
                <p className='font-poppins text-sm'>Dues</p>
              </div>
            </Link>
          </li>
          <li>
            <Link to="/certification">
              <div className='flex flex-col items-center justify-center hover:bg-gray-300 p-1 rounded-sm cursor-pointer'>
                <GrDocumentUser className='size-6' />
                <p className='font-poppins text-sm'>Certification</p>
              </div>
            </Link>
          </li>
          <li>
            <Link to="/settings">
              <div className='flex flex-col items-center justify-center hover:bg-gray-300 p-1 rounded-sm cursor-pointer'>
                <SlSettings className='size-6' />
                <p className='font-poppins text-sm'>Settings</p>
              </div>
            </Link>
          </li>
          <li>
            <Link to="/login">
              <div className='flex flex-col items-center justify-center hover:bg-gray-300 p-1 rounded-sm cursor-pointer'>
                <MdOutlineLogout className='size-6' />
                <p className='font-poppins text-sm'>Logout</p>
              </div>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default TopNav