import React from 'react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

const Login = () => {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className='flex flex-col justify-center items-center gap-10 font-poppins w-full'>
        {/* <img src="" alt="" /> */}
        <div className='size-40 rounded-full bg-gray-300'></div>
        <p className='text-3xl font-semibold'>Welcome Back!</p>
        <div className='flex flex-col gap-3 w-[65%]'>
          <label htmlFor="username" className='ml-3'>Username</label>
          <input type="text" name="" id="" className='border border-black p-3 rounded-md' placeholder='Enter your Username' />
          <label htmlFor="password" className='ml-3'>Password</label>
          <input type="password" name="" id="" className='border border-black p-3 rounded-md' placeholder='Enter your Password' />
          <p className='text-sm self-end'>Forgot Password?</p>
        </div>
        <Link to="/members" className='w-[65%]'>
          <Button className="bg-blue-button font-light text-md px-10 py-7 w-full">Log In</Button>
        </Link>
      </div>
    </div>
  )
}

export default Login