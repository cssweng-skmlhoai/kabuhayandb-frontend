import React, { useEffect, useState } from 'react'
import TopNav from '@/components/AdminCompts/TopNav';
import Sidebar from '@/components/AdminCompts/Sidebar';
import { Link } from 'react-router-dom';
import { IoIosArrowRoundBack } from 'react-icons/io';
import axios from 'axios';

const MonthlyDues = () => {
  const [collectionEff, setCollectionEff] = useState({});
  const [summaryDueType, setSummaryDueType] = useState([]);
  const [summaryDueHH, setSummaryDueHH] = useState([]);
  const [totalUnpaid, setTotalUnpaid] = useState({});

  const API_SECRET = import.meta.env.VITE_API_SECRET;
  const API_URL = "https://kabuhayandb-backend.onrender.com";

  useEffect(() => {
    axios.get(`${API_URL}/dues/report`, {
      headers: {
        Authorization: `Bearer ${API_SECRET}`,
      },
    }).then((res) => {
      setCollectionEff(res.data.collection_efficiency);
      setSummaryDueType(res.data.summary_due_type);
      setSummaryDueHH(res.data.summary_due_household);
      setTotalUnpaid(res.data.total_unpaid_dues);
    }).catch((err) => {
      console.log(err);
    });
  }, [API_SECRET]);

  return (
    <div className='pb-35 xl:pb-0'>
      <TopNav />

      <div className="flex flex-col xl:flex-row flex-1 relative">
        <Sidebar />
        <div className="flex-1 relative">
          <div className="pb-5 pt-8 px-7 flex flex-col bg-customgray1 gap-10 font-poppins h-max xl:bg-white xl:gap-0 xl:px-5 xl:pt-5">
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
                    <p className='text-lg'>₱ {parseFloat(collectionEff.total_billed).toLocaleString("en-US")}</p>
                  </div>
                  <div className='bg-customgray2 flex flex-col gap-1.5 items-center justify-center py-3 border border-black rounded-md font-medium xl:w-full'>
                    <p>Total Dues Collected</p>
                    <p className='text-lg'>₱ {parseFloat(collectionEff.total_collected).toLocaleString("en-US")}</p>
                  </div>
                  <div className='bg-customgray2 flex flex-col gap-1.5 items-center justify-center py-3 border border-black rounded-md font-medium xl:w-full'>
                    <p>Collection Efficiency</p>
                    <p className='text-lg'>{parseFloat(collectionEff.efficiency).toFixed(2)}%</p>
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
                        <th className="border-r border-b border-black px-4 py-2">Total Amount (₱)</th>
                        <th className="border-r border-b border-black px-4 py-2">Paid Amount (₱)</th>
                        <th className="border-b border-black px-4 py-2">Unpaid Amount (₱)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {summaryDueType.map((due) => (
                        <tr
                          key={due.due_type}
                        >
                          <td className="border-r border-b border-black px-4 py-2 bg-white">{due.due_type}</td>
                          <td className="border-r border-b border-black px-4 py-2 bg-white">{Number(due.total_dues).toLocaleString("en-US")}</td>
                          <td className="border-r border-b border-black px-4 py-2 bg-white">{parseFloat(due.total_amount).toLocaleString("en-US")}</td>
                          <td className="border-r border-b border-black px-4 py-2 bg-white">{parseFloat(due.paid_amount).toLocaleString("en-US")}</td>
                          <td className="border-b border-black px-4 py-2 bg-white">{parseFloat(due.unpaid_amount).toLocaleString("en-US")}</td>
                        </tr>
                      ))}
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
                        <th className="border-r border-b border-black px-4 py-2">Member Name</th>
                        <th className="border-b border-r border-black px-4 py-2">Total Dues</th>
                        <th className="border-b border-r border-black px-4 py-2">Total Amount (₱)</th>
                        <th className="border-b border-black px-4 py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {summaryDueHH.map((due) => (
                        <tr
                          key={due.household_id}
                        >
                          <td className="border-r border-b border-black px-4 py-2 bg-white">{due.block_no}</td>
                          <td className="border-r border-b border-black px-4 py-2 bg-white">{due.lot_no}</td>
                          <td className="border-r border-b border-black px-4 py-2 bg-white">{due.member_name || ""}</td>
                          <td className="border-r border-b border-black px-4 py-2 bg-white">{Number(due.total_dues).toLocaleString("en-US")}</td>
                          <td className="border-r border-b border-black px-4 py-2 bg-white">{parseFloat(due.total_amount).toLocaleString("en-US")}</td>
                          <td className="border-b border-black px-4 py-2 bg-white">{due.payment_status}</td>
                        </tr>
                      ))}
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
                        <td className="border-b border-black px-4 py-2 bg-white">{Number(totalUnpaid.total_unpaid_dues).toLocaleString("en-US")}</td>
                      </tr>
                      <tr>
                        <td className="border-r border-b border-black px-4 py-2 bg-white">Total Unpaid Amount</td>
                        <td className="border-b border-black px-4 py-2 bg-white">₱ {parseFloat(totalUnpaid.total_unpaid_amount).toLocaleString("en-US")}</td>
                      </tr>
                      <tr>
                        <td className="border-r border-b border-black px-4 py-2 bg-white">Number of Affected Members</td>
                        <td className="border-b border-black px-4 py-2 bg-white">{totalUnpaid.affected_households}</td>
                      </tr>
                      <tr>
                        <td className="border-r border-b border-black px-4 py-2 bg-white">Average Unpaid per Household</td>
                        <td className="border-b border-black px-4 py-2 bg-white">₱ {parseFloat(totalUnpaid.average_unpaid_per_household).toLocaleString("en-US")}</td>
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