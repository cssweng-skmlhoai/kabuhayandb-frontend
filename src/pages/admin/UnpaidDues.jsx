import React, { useState } from "react";
import TopNav from "@/components/AdminCompts/TopNav";
import Sidebar from "@/components/AdminCompts/Sidebar";
import { IoIosArrowRoundBack } from "react-icons/io";

const UnpaidDues = () => {
  const [filterType, setFilterType] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // hardcoded data for now
  const mockReports = [
    {
      member_name: "Juan Dela Cruz",
      filter_value: "Blk 5, Lot 10",
      dues: [
        {
          due_type: "Monthly Amortization",
          amount_due: 7500.0,
          amount_paid: 11.0,
          balance: 7489.0,
          due_date: "08/01/2024",
        },
        {
          due_type: "Penalties",
          amount_due: 4000.0,
          amount_paid: 22.0,
          balance: 3978.0,
          due_date: "09/01/2024",
        },
      ],
    },
    {
      member_name: "Maria Santos",
      filter_value: "Blk 8, Lot 3",
      dues: [
        {
          due_type: "Monthly Amortization",
          amount_due: 7600.0,
          amount_paid: 10.0,
          balance: 7590.0,
          due_date: "08/01/2024",
        },
        {
          due_type: "Penalties",
          amount_due: 3000.0,
          amount_paid: 20.0,
          balance: 2980.0,
          due_date: "09/01/2024",
        },
      ],
    },
  ];

  //uses mock data since no backend yet
  const handleGenerate = () => {
  setMessage("");
  setLoading(true);

  
  setTimeout(() => {
    const search = filterValue.trim().toLowerCase();

    const filteredReports = mockReports.filter((r) => {
      // allows us to have data even without a filter, gotta press generate report first tho
      const combined = `${r.member_name} ${r.filter_value} ${r.dues
        .map((d) => `${d.due_type} ${d.amount_due} ${d.amount_paid} ${d.due_date}`)
        .join(" ")}`.toLowerCase();

      return combined.includes(search);
    });

    if (filteredReports.length === 0) {
      setMessage("No matching records found.");
    }

    setReports(filteredReports);
    setLoading(false);
  }, 300);
};


  return (
    <div className="pb-35 xl:pb-0 min-h-screen">
      <TopNav />
      <div className="flex flex-col xl:flex-row flex-1 relative">
        <Sidebar />

        <div className="flex-1 bg-customgray1 p-8 xl:p-10">
          {/* Back Button */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => window.history.back()}
              className="flex items-center text-gray-700 hover:text-gray-900 transition"
            >
              <IoIosArrowRoundBack className="size-8" />
              <span className="text-lg font-medium">Back</span>
            </button>
          </div>

          {/* Main Card */}
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
            <h1 className="text-2xl font-semibold text-center mb-2">
              Unpaid Due Report
            </h1>
            <p className="text-sm text-gray-600 text-center mb-6">
              View members with unpaid dues by selecting a filter and entering details.
            </p>

            {/* Filter Section */}
            <div className="flex flex-col md:flex-row gap-3 items-center justify-center mb-6">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full md:w-1/3 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
              >
                <option value="">Filter By:</option>
                <option value="memberType">Member Type</option>
                <option value="household">Household</option>
                <option value="blockNo">Block No.</option>
                <option value="lotNo">Lot No.</option>
              </select>

              <input
                type="text"
                placeholder="Enter details"
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                className="w-full md:w-1/3 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
              />

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full md:w-1/4 bg-slate-700 text-white py-2.5 rounded hover:bg-slate-800 transition"
              >
                {loading ? "Generating..." : "Generate Report"}
              </button>
            </div>

            {/* Message */}
            {message && (
              <div className="text-center text-gray-600 text-sm mb-4">
                {message}
              </div>
            )}

            {/* Report List */}
            <div className="space-y-6">
              {reports.map((member, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-md shadow-sm p-4"
                >
                  <h2 className="font-semibold mb-3">
                    For {member.member_name}, {member.filter_value}
                  </h2>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="bg-gray-100 border-b text-gray-700">
                          <th className="text-left py-2 px-3 font-medium">
                            Due Type
                          </th>
                          <th className="text-left py-2 px-3 font-medium">
                            Amount Due (₱)
                          </th>
                          <th className="text-left py-2 px-3 font-medium">
                            Amount Paid (₱)
                          </th>
                          <th className="text-left py-2 px-3 font-medium">
                            Balance (₱)
                          </th>
                          <th className="text-left py-2 px-3 font-medium">
                            Due Date
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {member.dues.map((due, i) => (
                          <tr key={i} className="border-b">
                            <td className="py-2 px-3">{due.due_type}</td>
                            <td className="py-2 px-3">
                              {due.amount_due.toLocaleString("en-US")}
                            </td>
                            <td className="py-2 px-3">
                              {due.amount_paid.toLocaleString("en-US")}
                            </td>
                            <td className="py-2 px-3">
                              {due.balance.toLocaleString("en-US")}
                            </td>
                            <td className="py-2 px-3">{due.due_date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}

              {!loading && reports.length === 0 && !message && (
                <div className="p-4 bg-gray-50 text-center rounded border border-gray-200">
                  <p className="text-gray-600 text-sm">No unpaid dues found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnpaidDues;
