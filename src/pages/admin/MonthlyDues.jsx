import React from 'react'
import TopNav from '@/components/AdminCompts/TopNav';
import Sidebar from '@/components/AdminCompts/Sidebar';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { IoIosArrowRoundBack } from 'react-icons/io';

const MonthlyDues = () => {
  return (
    <div>
      <TopNav />

      <div className="flex flex-col xl:flex-row flex-1 relative">
        <Sidebar />
        <div className="flex-1 relative">
          <div className="py-5 px-7 flex flex-col bg-customgray1 gap-10 font-poppins h-max xl:bg-white xl:gap-0 xl:px-5">
            <div className="hidden xl:flex justify-between w-full items-end p-5">
              {/* desktop only/separate component */}
              <div className="flex flex-col">
                <p className="font-semibold text-3xl">Monthly Due Report</p>
                <p>View Monthly Due Report</p>
              </div>
            </div>

            <div className="flex flex-col gap-11 xl:flex xl:border xl:border-black xl:mr-3 xl:mt-3 xl:mb-10 xl:rounded-lg xl:flex-col xl:px-40 xl:py-10">
              <Link
                to="/searchMemberDues"
                className="cursor-pointer px-3 rounded-md border border-black flex items-center gap-2 w-30 md:w-40 md:gap-8"
              >
                <IoIosArrowRoundBack className="size-10" />
                <p className="font-poppins text-lg">Back</p>
              </Link>

              <div>
                <p className="font-semibold text-center text-3xl">Monthly Due Report</p>
                <p className="text-center">View Monthly Due Report</p>
              </div>

              <div className='flex flex-col justify-center items-center gap-3'>
                <p className='font-medium text-lg'>Monthly Collection Efficiency</p>
                <div className='w-full flex flex-col gap-4 xl:flex-row xl:justify-between'>
                  <div className='bg-customgray2 flex flex-col gap-1.5 items-center justify-center py-3 border border-black rounded-md font-medium xl:w-full'>
                    <p>Total Dues Billed</p>
                    <p className='text-lg'>₱ 200,000.00</p>
                  </div>
                  <div className='bg-customgray2 flex flex-col gap-1.5 items-center justify-center py-3 border border-black rounded-md font-medium xl:w-full'>
                    <p>Total Dues Collected</p>
                    <p className='text-lg'>₱ 150,000.00</p>
                  </div>
                  <div className='bg-customgray2 flex flex-col gap-1.5 items-center justify-center py-3 border border-black rounded-md font-medium xl:w-full'>
                    <p>Collection Efficiency</p>
                    <p className='text-lg'>75%</p>
                  </div>
                </div>
              </div>

              <div className='flex flex-col justify-center items-center gap-3'>
                <p className='font-medium text-lg'>Summary of Dues by Type</p>
                <div className='w-full overflow-auto'>
                  <table className="w-full border border-black border-separate rounded-md text-center">
                    <thead className="bg-customgray2">
                      <tr>
                        <th className="border-r border-b border-black px-4 py-2 font-semibold">Due Type</th>
                        <th className="border-r border-b border-black px-4 py-2">Total Dues</th>
                        <th className="border-b border-black px-4 py-2">Total Amount (₱)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border-r border-b border-black px-4 py-2 bg-white">Monthly Amortization</td>
                        <td className="border-r border-b border-black px-4 py-2 bg-white">30</td>
                        <td className="border-b border-black px-4 py-2 bg-white">90,000.00</td>
                      </tr>
                      <tr>
                        <td className="border-r border-b border-black px-4 py-2 bg-white">Monthly Dues</td>
                        <td className="border-r border-b border-black px-4 py-2 bg-white">40</td>
                        <td className="border-b border-black px-4 py-2 bg-white">40,000.00</td>
                      </tr>
                      <tr>
                        <td className="border-r border-b border-black px-4 py-2 bg-white">Taxes</td>
                        <td className="border-r border-b border-black px-4 py-2 bg-white">10</td>
                        <td className="border-b border-black px-4 py-2 bg-white">30,000.00</td>
                      </tr>
                      <tr>
                        <td className="border-r border-b border-black px-4 py-2 bg-white">Penalties</td>
                        <td className="border-r border-b border-black px-4 py-2 bg-white">5</td>
                        <td className="border-b border-black px-4 py-2 bg-white">20,000.00</td>
                      </tr>
                      <tr>
                        <td className="border-r border-black px-4 py-2 bg-white">Others</td>
                        <td className="border-r border-black px-4 py-2 bg-white">2</td>
                        <td className="px-4 py-2 bg-white">5,000.00</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className='flex flex-col justify-center items-center gap-3'>
                <p className='font-medium text-lg'>Summary of Dues by Household (BLK and LOT)</p>
                <div className='w-full overflow-auto'>
                  <table className="w-full border border-black border-separate rounded-md text-center">
                    <thead className="bg-customgray2">
                      <tr>
                        <th className="border-r border-b border-black px-4 py-2 font-semibold">Block #</th>
                        <th className="border-r border-b border-black px-4 py-2">Lot #</th>
                        <th className="border-b border-r border-black px-4 py-2">Total Dues</th>
                        <th className="border-b border-r border-black px-4 py-2">Total Amount (₱)</th>
                        <th className="border-b border-black px-4 py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border-r border-b border-black px-4 py-2 bg-white">11</td>
                        <td className="border-r border-b border-black px-4 py-2 bg-white">11</td>
                        <td className="border-r border-b border-black px-4 py-2 bg-white">3</td>
                        <td className="border-r border-b border-black px-4 py-2 bg-white">7,500.00</td>
                        <td className="border-b border-black px-4 py-2 bg-white">Partial (1 Unpaid)</td>
                      </tr>
                      <tr>
                        <td className="border-r border-b border-black px-4 py-2 bg-white">22</td>
                        <td className="border-r border-b border-black px-4 py-2 bg-white">22</td>
                        <td className="border-r border-b border-black px-4 py-2 bg-white">2</td>
                        <td className="border-r border-b border-black px-4 py-2 bg-white">4,000.00</td>
                        <td className="border-b border-black px-4 py-2 bg-white">Fully Paid</td>
                      </tr>
                      <tr>
                        <td className="border-r border-b border-black px-4 py-2 bg-white">33</td>
                        <td className="border-r border-b border-black px-4 py-2 bg-white">33</td>
                        <td className="border-r border-b border-black px-4 py-2 bg-white">5</td>
                        <td className="border-r border-b border-black px-4 py-2 bg-white">3,000.00</td>
                        <td className="border-b border-black px-4 py-2 bg-white">Unpaid</td>
                      </tr>
                      <tr>
                        <td className="border-r border-b border-black px-4 py-2 bg-white">44</td>
                        <td className="border-r border-b border-black px-4 py-2 bg-white">44</td>
                        <td className="border-r border-b border-black px-4 py-2 bg-white">7</td>
                        <td className="border-r border-b border-black px-4 py-2 bg-white">10,000.00</td>
                        <td className="border-b border-black px-4 py-2 bg-white">Fully Paid</td>
                      </tr>
                      <tr>
                        <td className="border-r border-black px-4 py-2 bg-white">55</td>
                        <td className="border-r border-black px-4 py-2 bg-white">55</td>
                        <td className="border-r border-black px-4 py-2 bg-white">1</td>
                        <td className="border-r border-black px-4 py-2 bg-white">2,100.00</td>
                        <td className="border-black px-4 py-2 bg-white">Unpaid</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className='flex flex-col justify-center items-center gap-3'>
                <p className='font-medium text-lg'>Overall Totals of Unpaid Dues</p>
                <div className='w-full overflow-auto'>
                  <table className="w-full border border-black border-separate rounded-md text-center">
                    <thead className="bg-customgray2">
                      <tr>
                        <th className="border-r border-b border-black px-4 py-2 font-semibold">Metric</th>
                        <th className="border-b border-black px-4 py-2">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border-r border-b border-black px-4 py-2 bg-white">Total Unpaid Dues</td>
                        <td className="border-b border-black px-4 py-2 bg-white">45</td>
                      </tr>
                      <tr>
                        <td className="border-r border-b border-black px-4 py-2 bg-white">Total Unpaid Amount</td>
                        <td className="border-b border-black px-4 py-2 bg-white">₱ 68,500.00</td>
                      </tr>
                      <tr>
                        <td className="border-r border-b border-black px-4 py-2 bg-white">Number of Affected Households</td>
                        <td className="border-b border-black px-4 py-2 bg-white">18</td>
                      </tr>
                      <tr>
                        <td className="border-r border-b border-black px-4 py-2 bg-white">Average Unpaid per Household</td>
                        <td className="border-b border-black px-4 py-2 bg-white">₱ 3,805.56</td>
                      </tr>

                      <tr className="bg-customgray2">
                        <td className="border-b border-r border-black px-4 py-2 font-semibold">Breakdown by Due Type</td>
                        <td className="border-b border-black px-4 py-2 font-semibold"></td>
                      </tr>

                      <tr>
                        <td className="border-r border-b border-black px-4 py-2 bg-white">Monthly Amortization</td>
                        <td className="border-b border-black px-4 py-2 bg-white">₱ 6,000.00</td>
                      </tr>
                      <tr>
                        <td className="border-r border-b border-black px-4 py-2 bg-white">Monthly Dues</td>
                        <td className="border-b border-black px-4 py-2 bg-white">₱ 25,000.00</td>
                      </tr>
                      <tr>
                        <td className="border-r border-b border-black px-4 py-2 bg-white">Taxes</td>
                        <td className="border-b border-black px-4 py-2 bg-white">₱ 20,000.00</td>
                      </tr>
                      <tr>
                        <td className="border-r border-b border-black px-4 py-2 bg-white">Penalties</td>
                        <td className="border-b border-black px-4 py-2 bg-white">₱ 15,000.00</td>
                      </tr>
                      <tr>
                        <td className="border-r border-black px-4 py-2 bg-white">Others</td>
                        <td className="border-black px-4 py-2 bg-white">₱ 2,500.00</td>
                      </tr>

                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div >
    </div >
  )
}

export default MonthlyDues