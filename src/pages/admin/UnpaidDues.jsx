import React, { useEffect, useState } from "react";
import TopNav from "@/components/AdminCompts/TopNav";
import Sidebar from "@/components/AdminCompts/Sidebar";
import { IoIosArrowRoundBack } from "react-icons/io";
import axios from "axios";

const UnpaidDues = () => {
  const [filterType, setFilterType] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [filteredReport, setFilteredReport] = useState([]); 
  const [message, setMessage] = useState("");

  const [unpaidDuesReport, setUnpaidDuesReport] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_SECRET = import.meta.env.VITE_API_SECRET;
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/dues/unpaidDuesReport`, {
          headers: { Authorization: `Bearer ${API_SECRET}` },
        });
        setUnpaidDuesReport(response.data);
        setFilteredReport(response.data); // show all initially
      } catch (err) {
        console.error("API error:", err);
        setError("Failed to load report.");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [API_URL, API_SECRET]);

  // To format date by MM/DD/YYYY
  const formatDueDate = (isoDateString) => {
    if (!isoDateString) return "";
    const date = new Date(isoDateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  // For generate report
  const handleGenerate = () => {
    setMessage("");
    const search = filterValue.trim().toLowerCase();

    if (!search) {
      setFilteredReport(unpaidDuesReport);
      return;
    }

    const results = unpaidDuesReport.filter(member => {
      // Search in member name and address
      const matchesMember = member.member_name.toLowerCase().includes(search);
      const matchesAddress = member.filter_value.toLowerCase().includes(search);

      // Search inside dues (due_type, due_date)
      const matchesDues = member.dues.some(due =>
        due.due_type.toLowerCase().includes(search) ||
        due.due_date.includes(search)
      );

      // Apply filterType if selected
      if (filterType === "blockNo") {
        return member.filter_value.toLowerCase().includes(`blk ${search}`);
      }
      if (filterType === "lotNo") {
        return member.filter_value.toLowerCase().includes(`lot ${search}`);
      }
      if (filterType === "household") {
        return matchesAddress;
      }
      // If "Filter By:" is "None" or empty, search all
      return matchesMember || matchesAddress || matchesDues;
    });

    setFilteredReport(results);
    if (results.length === 0) {
      setMessage("No matching records found.");
    }
  };

  useEffect(() => {
    setFilterValue("");
    setFilteredReport(unpaidDuesReport);
    setMessage("");
  }, [filterType, unpaidDuesReport]);

  return (
    <div className="pb-35 xl:pb-0 min-h-screen">
      <TopNav />
      <div className="flex flex-col xl:flex-row flex-1 relative">
        <Sidebar />
        <div className="flex-1 relative">
           {/* Main Container with correct backgrounds */}
          <div className="pb-5 pt-8 px-7 flex flex-col bg-customgray1 gap-10 font-poppins h-max xl:bg-white xl:gap-0 xl:px-5 xl:pt-5">
            
            {/* Header Section (Desktop) */}
            <div className="hidden xl:flex justify-between w-full items-end p-5">
              <div className="flex flex-col">
                <p className="font-semibold text-3xl">Unpaid Due Report</p>
                <p>View members with unpaid dues</p>
              </div>
            </div>

            {/* Main Content Card matching MonthlyDues style */}
            <div className="flex flex-col gap-11 xl:flex xl:border xl:border-black xl:mr-3 xl:mt-3 xl:mb-10 xl:rounded-lg xl:flex-col xl:px-10 xl:py-10 bg-white">
              
              {/* Back Button with Border */}
              <button
                onClick={() => window.history.back()}
                className="cursor-pointer px-3 py-1 rounded-md border border-black flex items-center justify-center gap-2 w-32 md:w-40 hover:bg-gray-50 transition"
                >
                <IoIosArrowRoundBack className="size-8" />
                <p className="font-poppins text-lg">Back</p>
              </button>

              {/* Title inside card */}
              <div>
                <h1 className="font-semibold text-center text-3xl">
                  Unpaid Due Report
                </h1>
                <p className="text-sm text-gray-600 text-center mt-2">
                  View members with unpaid dues by selecting a filter and entering details.
                </p>
              </div>

              {/* Filter Section */}
              <div className="flex flex-col md:flex-row gap-3 items-center justify-center">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full md:w-1/3 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
                >
                  <option value="">Filter By:</option>
                  <option value="household">Household</option>
                  <option value="blockNo">Block No.</option>
                  <option value="lotNo">Lot No.</option>
                </select>

                <input
                  type="text"
                  placeholder={
                    filterType === "blockNo"
                      ? "Enter block number"
                      : filterType === "lotNo"
                      ? "Enter lot number"
                      : filterType === "household"
                      ? "Enter household number"
                      : "Enter household, name, or due type"
                  }
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                  className="w-full md:w-1/3 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
                />

                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="w-full md:w-1/4 bg-slate-700 text-white py-2.5 rounded hover:bg-slate-800 transition"
                >
                  {loading ? "Loading..." : "Generate Report"}
                </button>
              </div>

              {/* Message */}
              {message && (
                <div className="text-center text-gray-600 text-sm mb-4">
                  {message}
                </div>
              )}

              {/* Results */}
              {loading ? (
                <p className="text-center py-4">Loading...</p>
              ) : error ? (
                <p className="text-center py-4 text-red-600">{error}</p>
              ) : filteredReport.length === 0 ? (
                <p className="text-center py-4 text-gray-600">No unpaid dues found.</p>
              ) : (
                <div className="space-y-6">
                  {filteredReport.map((member, index) => (
                    <div
                      key={index}
                      className="bg-white border border-black rounded-md p-4"
                    >
                      <h2 className="font-semibold mb-3">
                        For {member.member_name}, {member.filter_value}
                      </h2>
                      <div className="overflow-x-auto">
                        <table className="w-full border border-black border-separate rounded-md text-center">
                          <thead className="bg-customgray2">
                            <tr>
                              <th className="border-r border-b border-black px-4 py-2 font-semibold text-left">Due Type</th>
                              <th className="border-r border-b border-black px-4 py-2 text-left">Amount Due (₱)</th>
                              <th className="border-r border-b border-black px-4 py-2 text-left">Amount Paid (₱)</th>
                              <th className="border-r border-b border-black px-4 py-2 text-left">Balance (₱)</th>
                              <th className="border-b border-black px-4 py-2 text-left">Due Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {member.dues.map((due, i) => (
                              <tr key={i}>
                                <td className="border-r border-b border-black px-4 py-2 bg-white text-left">{due.due_type}</td>
                                <td className="border-r border-b border-black px-4 py-2 bg-white text-left">
                                  {due.amount_due.toLocaleString()}
                                </td>
                                <td className="border-r border-b border-black px-4 py-2 bg-white text-left">
                                  {due.amount_paid.toLocaleString()}
                                </td>
                                <td className="border-r border-b border-black px-4 py-2 bg-white text-left">
                                  {due.balance.toLocaleString()}
                                </td>
                                <td className="border-b border-black px-4 py-2 bg-white text-left">{formatDueDate(due.due_date)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
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