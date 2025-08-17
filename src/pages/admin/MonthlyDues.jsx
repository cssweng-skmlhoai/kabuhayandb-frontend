import React, { useEffect, useState } from 'react'
import TopNav from '@/components/AdminCompts/TopNav';
import Sidebar from '@/components/AdminCompts/Sidebar';
import { Link } from 'react-router-dom';
import { IoIosArrowRoundBack } from 'react-icons/io';
import ReportTable from '@/components/AdminCompts/ReportTable';
import { fetchDuesReport } from '@/hooks/DuesUtils';

const MonthlyDues = () => {
  const [collectionEff, setCollectionEff] = useState({});
  const [summaryDueType, setSummaryDueType] = useState([]);
  const [summaryDueHH, setSummaryDueHH] = useState([]);
  const [totalUnpaid, setTotalUnpaid] = useState({});

  useEffect(() => {
    fetchDuesReport(setCollectionEff, setSummaryDueType, setSummaryDueHH, setTotalUnpaid);
  }, []);

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
                  <ReportTable
                    data={summaryDueType}
                    columns={[
                      { label: "Due Type", key: "due_type", className: "border-r font-semibold" },
                      { label: "Total Dues", key: "total_dues", className: "border-r", render: d => Number(d.total_dues).toLocaleString() },
                      { label: "Total Amount (₱)", key: "total_amount", className: "border-r", render: d => parseFloat(d.total_amount).toLocaleString() },
                      { label: "Paid Amount (₱)", key: "paid_amount", className: "border-r", render: d => parseFloat(d.paid_amount).toLocaleString() },
                      { label: "Unpaid Amount (₱)", key: "unpaid_amount", render: d => parseFloat(d.unpaid_amount).toLocaleString() },
                    ]}
                  />
                </div>
              </div>

              <div className='flex flex-col justify-center items-center gap-3'>
                <p className='font-medium text-lg'>Summary of Dues by Household (BLK and LOT)</p>
                <div className='w-full overflow-auto'>
                  <ReportTable
                    data={summaryDueHH}
                    columns={[
                      { label: "Block #", key: "block_no", className: "border-r font-semibold" },
                      { label: "Lot #", key: "lot_no", className: "border-r" },
                      { label: "Member Name", key: "name", className: "border-r", render: d => `${d.first_name} ${d.last_name}` },
                      { label: "Total Dues", key: "total_dues", className: "border-r", render: d => Number(d.total_dues).toLocaleString() },
                      { label: "Total Amount (₱)", key: "total_amount", className: "border-r", render: d => parseFloat(d.total_amount).toLocaleString() },
                      { label: "Status", key: "payment_status" },
                    ]}
                  />
                </div>
              </div>

              <div className='flex flex-col justify-center items-center gap-3'>
                <p className='font-medium text-lg'>Overall Totals of Unpaid Dues</p>
                <div className='w-full overflow-auto'>
                  <ReportTable
                    data={[
                      { metric: "Total Unpaid Dues", value: Number(totalUnpaid.total_unpaid_dues).toLocaleString() },
                      { metric: "Total Unpaid Amount", value: `₱ ${parseFloat(totalUnpaid.total_unpaid_amount).toLocaleString()}` },
                      { metric: "Number of Affected Members", value: totalUnpaid.affected_households },
                      { metric: "Average Unpaid per Household", value: `₱ ${parseFloat(totalUnpaid.average_unpaid_per_household).toLocaleString()}` },
                    ]}
                    columns={[
                      { label: "Metric", key: "metric", className: "border-r font-semibold" },
                      { label: "Value", key: "value" },
                    ]}
                  />
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