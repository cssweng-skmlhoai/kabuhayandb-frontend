import React from 'react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { LuEye } from 'react-icons/lu'

const Login = () => {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className='flex flex-col justify-center items-center gap-10 font-poppins w-full lg:gap-6'>
        {/* <img src="" alt="" /> */}
        <div className='size-36 rounded-full bg-gray-300'></div>
        <p className='text-3xl font-semibold lg:text-2xl'>Welcome Back!</p>
        <div className='flex flex-col gap-3 w-[65%] md:items-center'>
          <label htmlFor="username" className='ml-3 md:w-3/5 lg:w-1/2 xl:w-2/5'>Username</label>
          <input type="text" name="" id="" className='border border-black p-3 rounded-md md:w-3/5 lg:w-1/2 xl:w-2/5' placeholder='Enter your Username' required />
          <label htmlFor="password" className='ml-3 md:w-3/5 lg:w-1/2 xl:w-2/5'>Password</label>
          <div className='w-full flex flex-col items-center relative'>
            <div className="relative w-full md:w-3/5 lg:w-1/2 xl:w-2/5">
              <input type="password" className="w-full border border-black p-3 pr-10 rounded-md" placeholder="Enter your Password" required />
              <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600">
                <LuEye className='size-5' />{/* <LuEyeOff /> */}
              </button>
            </div>
          </div>
          <p className='text-sm text-right md:w-3/5 lg:w-1/2 xl:w-2/5'>Forgot Password?</p>
        </div>
        <Link to="/members" className='w-[65%] flex justify-center'>
          <Button className="bg-blue-button font-light text-md px-10 py-7 w-full md:w-3/5 lg:w-1/2 xl:w-2/5">Log In</Button>
        </Link>
      </div>
    </div>
  )
}

export default Login