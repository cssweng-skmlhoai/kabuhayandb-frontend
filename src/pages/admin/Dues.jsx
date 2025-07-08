import React from 'react'
import TopNav from '@/components/AdminCompts/TopNav'
import { IoSearchOutline } from 'react-icons/io5'
import { LiaFileDownloadSolid } from 'react-icons/lia';
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
import Sidebar from '@/components/AdminCompts/Sidebar';

const Dues = () => {
  return (
    <div>
      <TopNav />

      <div className='flex flex-col xl:flex-row flex-1 relative'>
        <Sidebar />
        <div className='flex-1 relative'>
          <div className='py-5 px-7 flex flex-col bg-customgray1 gap-10 font-poppins xl:bg-white xl:gap-0 xl:px-5'>
            <div className='hidden xl:flex justify-between w-full items-end p-5'> {/* desktop only/separate component */}
              <div className='flex flex-col'>
                <p className='font-semibold text-3xl'>Member Dues</p>
                <p>Update Member Dues</p>
              </div>

              <div className='flex gap-3'>
                <Button className='rounded-sm bg-white border-1 border-black hover:bg-gray-300 text-customgray3 cursor-pointer'>
                  <LiaFileDownloadSolid className='size-5' />
                  <p>Export</p>
                </Button>
              </div>
            </div>

            <div className='flex flex-col gap-10 xl:flex xl:border xl:border-black xl:mr-3 xl:mt-3 xl:mb-10 xl:rounded-lg xl:flex-col xl:gap-10 xl:px-8 xl:py-10'>
              <div className="relative w-full self-center xl:w-2/5">
                <IoSearchOutline className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 cursor-pointer size-5" />
                <input type="text" placeholder="Search Member Name" className="border border-gray-300 rounded-md p-3 w-full bg-white xl:border-black xl:py-2"
                />
              </div>

              <div className='px-5 py-4 bg-white flex flex-col items-center gap-3 rounded-sm xl:flex-row xl:justify-center'>
                <p className='font-medium'>Select Type of Payment:</p>
                <Select>
                  <SelectTrigger className="bg-customgray2 w-[80%] !py-1 !h-auto rounded-md border border-black xl:w-1/4 xl:!py-1.5">
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

              <div className='flex flex-col gap-3 xl:grid xl:grid-cols-2 xl:gap-10 xl:w-3/4 xl:m-auto'>
                <div className='flex flex-col gap-2 xl:gap-4 xl:col-start-1'>
                  <label htmlFor="duedate">Due Date</label>
                  <input className="bg-customgray2 p-2 text-md rounded-sm xl:border xl:border-black" type="date" name="" id="" />

                  <label htmlFor="amount">Amount</label>
                  <input className="bg-customgray2 p-2 text-md rounded-sm xl:border xl:border-black" type="number" name="" id="" placeholder='₱ 0.00' />
                </div>

                <div className='flex flex-col gap-2 xl:gap-0 xl:justify-between xl:col-start-2'>
                  <div className='flex flex-col gap-2 xl:gap-4'>
                    <label htmlFor="Status">Status</label>
                    <Select>
                      <SelectTrigger className="bg-customgray2 w-full !py-2.5 !h-auto rounded-sm mb-3 xl:border xl:border-black">
                        <SelectValue placeholder="Options" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Paid">Paid</SelectItem>
                        <SelectItem value="Unpaid">Unpaid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button className="bg-blue-button w-full xl:!py-[11px] xl:!h-auto">Update</Button>
                </div>
              </div>

              <div className='flex flex-col gap-3'>
                <div className='p-5 bg-white flex flex-col items-center rounded-sm gap-3 xl:gap-5'>
                  <label htmlFor="balance" className='font-medium'>Outstanding Balance</label>
                  <input className="w-full bg-customgray2 p-2 text-md rounded-sm xl:w-2/5 xl:border xl:border-black xl:mb-7" type="text" name="" id="" placeholder='₱ 0.00' />

                  <p className='font-medium'>Payment History</p>
                  <div className="w-full overflow-x-auto">
                    <table className="w-full table-auto border-separate border-spacing-y-2 text-sm">
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
                          <td className="px-4 py-2 rounded-l-md">0001</td>
                          <td className="px-4 py-2">₱ 420.00</td>
                          <td className="px-4 py-2">Monthly Amortization</td>
                          <td className="px-4 py-2 rounded-r-md">20/03/25</td>
                        </tr>
                        <tr className="bg-customgray2 rounded-md">
                          <td className="px-4 py-2 rounded-l-md">0002</td>
                          <td className="px-4 py-2">₱ 560.00</td>
                          <td className="px-4 py-2">Monthly Dues</td>
                          <td className="px-4 py-2 rounded-r-md">10/02/25</td>
                        </tr>
                        <tr className="bg-customgray2 rounded-md">
                          <td className="px-4 py-2 rounded-l-md">0003</td>
                          <td className="px-4 py-2">₱ 320.00</td>
                          <td className="px-4 py-2">Monthly Taxes</td>
                          <td className="px-4 py-2 rounded-r-md">30/01/25</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
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
        </div>
      </div>
    </div>
  )
}

export default Dues