import React from 'react'
import Logo from "@/assets/SKMLHOAI_Logo.jpg"
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

const Landing = () => {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className='flex flex-col justify-center items-center gap-10 font-poppins'>
        <img src={Logo} alt="SKMLHOAI" className='size-48' />
        <p className='text-4xl font-semibold'>Kabuhayan DB</p>
        <p className='text-center w-3/4'>Maaaring pindutin ang button sa ibaba para tumuloy sa iyong account</p>
        <Link to="/login">
          <Button className="bg-blue-button font-light text-md px-10 py-7">Log In Here</Button>
        </Link>
      </div>
    </div>
  )
}

export default Landing