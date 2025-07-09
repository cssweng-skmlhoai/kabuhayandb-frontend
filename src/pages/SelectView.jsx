import { Button } from '@/components/ui/button'
import React from 'react'
import { Link } from 'react-router-dom'

// temporary page to select admin/member view
const SelectView = () => {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="w-full max-w-md px-4 sm:px-6 md:px-8 flex flex-col gap-6 items-center">
        <Link to="/members" className="w-full">
          <Button className="w-full text-base sm:text-lg md:text-xl lg:text-2xl px-6 sm:px-10 md:px-16 lg:px-20 py-5 sm:py-6 md:py-8 lg:py-10">
            Admin View
          </Button>
        </Link>
        <Link to="/memberView" className="w-full">
          <Button className="w-full text-base sm:text-lg md:text-xl lg:text-2xl px-6 sm:px-10 md:px-16 lg:px-20 py-5 sm:py-6 md:py-8 lg:py-10">
            Member View
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default SelectView