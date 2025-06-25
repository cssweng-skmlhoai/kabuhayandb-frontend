import React from 'react'
import TopNav from '@/components/AdminCompts/TopNav'
import { IoSearchOutline } from 'react-icons/io5'
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

const Dues = () => {
  return (
    <div>
      <TopNav />

      <div className='py-5 px-7 flex flex-col bg-customgray1 gap-10'>
        <div className="relative w-full self-center">
          <IoSearchOutline className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 cursor-pointer size-5" />
          <input type="text" placeholder="Search Member Name" className="border border-gray-300 rounded-md p-3 w-full bg-white"
          />
        </div>

        <div className='px-5 py-4 bg-white flex flex-col items-center gap-3 font-poppins rounded-sm'>
          <p className='font-medium'>Select Type of Payment:</p>
          <Select>
            <SelectTrigger className="bg-customgray2 w-[80%] !py-1 !h-auto rounded-md border border-black">
              <SelectValue placeholder="Options" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="amortization">Monthly Amortization</SelectItem>
              <SelectItem value="dues">Monthly Dues</SelectItem>
              <SelectItem value="taxes">Taxes</SelectItem>
              <SelectItem value="penalties">Penalties</SelectItem>
              <SelectItem value="others">Others</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='flex flex-col gap-3 font-poppins'>
          <label htmlFor="duedate">Due Date</label>
          <input className="bg-customgray2 p-2 text-md rounded-sm" type="date" name="" id="" />

          <label htmlFor="amount">Amount</label>
          <input className="bg-customgray2 p-2 text-md rounded-sm" type="text" name="" id="" placeholder='₱ 0.00' />

          <label htmlFor="Status">Status</label>
          <Select>
            <SelectTrigger className="bg-customgray2 w-full !py-2.5 !h-auto rounded-sm mb-3">
              <SelectValue placeholder="Options" />
            </SelectTrigger>
            <SelectContent>

            </SelectContent>
          </Select>

          <Button className="bg-blue-button">Update</Button>
        </div>

        <div className='flex flex-col gap-3'>
          <div className='p-5 bg-white flex flex-col items-center rounded-sm font-poppins gap-3'>
            <label htmlFor="balance" className='font-medium'>Outstanding Balance</label>
            <input className="w-full bg-customgray2 p-2 text-md rounded-sm" type="text" name="" id="" placeholder='₱ 0.00' />

            <p className='font-medium'>Payment History</p>
            <table className="w-full table-auto border-separate border-spacing-y-2 text-sm font-poppins">
              <thead>
                <tr className="text-left">
                  <th className="px-4 py-2 rounded-tl-md">Receipt No.</th>
                  <th className="px-4 py-2">Amount</th>
                  <th className="px-4 py-2">Type</th>
                  <th className="px-4 py-2 rounded-tr-md">Date</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-customgray2 rounded-md">
                  <td className="px-4 py-2 rounded-l-md">####</td>
                  <td className="px-4 py-2">₱ 0.00</td>
                  <td className="px-4 py-2">Monthly Amortization</td>
                  <td className="px-4 py-2 rounded-r-md">00/00/00</td>
                </tr>
                <tr className="bg-customgray2 rounded-md">
                  <td className="px-4 py-2 rounded-l-md">####</td>
                  <td className="px-4 py-2">₱ 0.00</td>
                  <td className="px-4 py-2">Monthly Amortization</td>
                  <td className="px-4 py-2 rounded-r-md">00/00/00</td>
                </tr>
              </tbody>
            </table>
          </div>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" className="" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>

      </div>
    </div>
  )
}

export default Dues