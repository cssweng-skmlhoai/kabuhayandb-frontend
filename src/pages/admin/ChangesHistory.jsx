import TopNav from "@/components/AdminCompts/TopNav";
import React, { useState, useEffect, useCallback } from "react";
import SideBar from "@/components/AdminCompts/SideBar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BsCalendar } from "react-icons/bs";
import { BsArrowDown } from "react-icons/bs";
import { SlArrowLeft } from "react-icons/sl";
import { SlArrowRight } from "react-icons/sl";
import axios from "axios";
import { toast } from "sonner";

const ChangesHistory = () => {
  const [availableAdmins, setAvailableAdmins] = useState([]);
  const [_selectedAdmin, setSelectedAdmin] = useState({
    id: "all",
    name: "All",
  });
  const [date, setDate] = useState();
  const [changedData, setChangedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const API_URL = import.meta.env.VITE_API_URL;
  const API_SECRET = import.meta.env.VITE_API_SECRET;

  const fetchChangeHistory = useCallback(async () => {
    const params = new URLSearchParams({
      page: currentPage.toString(),
      limit: "10",
    });

    if (searchTerm) params.append("search", searchTerm);

    if (_selectedAdmin && _selectedAdmin.id !== "all") {
      params.append("admin", _selectedAdmin.id);
    }

    const formatLocalTime = (dateObj) => {
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const day = String(dateObj.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    };

    if (date?.from) params.append("dateFrom", formatLocalTime(date.from));

    if (date?.to) params.append("dateTo", formatLocalTime(date.to));

    const url = `${API_URL}/changes?${params.toString()}`;

    try {
      setLoading(true);

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${API_SECRET}` },
      });

      let changes = res.data.changes || res.data.data || res.data.history || [];

      setChangedData(changes);
      setTotalPages(
        res.data.totalPages ||
          Math.ceil((res.data.total || changes.length) / 10) ||
          1
      );
      setTotalRecords(res.data.total || changes.length || 0);
      setAvailableAdmins((prevAdmins) => {
        const adminsMap = new Map();
        prevAdmins.forEach((admin) => adminsMap.set(admin.id, admin.name));

        changes.forEach((change) => {
          const adminId = change.admin_id;
          const adminName = change.changedBy;

          if (adminId && adminName) {
            adminsMap.set(adminId, adminName);
          }
        });

        const newAdminsArray = Array.from(adminsMap, ([id, name]) => ({
          id,
          name,
        }));

        return newAdminsArray;
      });
      console.log(availableAdmins);
    } catch (error) {
      console.error("Failed to fetch change history:", error);
      console.error("Request URL:", url);

      if (error.response?.status === 404) {
        toast.error("Backend route /changes not found.");
      } else {
        toast.error(
          error.response?.data?.error || "Failed to load change history"
        );
      }
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, date, _selectedAdmin, API_URL, API_SECRET]);

  useEffect(() => {
    fetchChangeHistory();
  }, [fetchChangeHistory]);

  const handleResetFilters = () => {
    setSelectedAdmin({ id: "all", name: "All" });
    setDate(undefined);
    setSearchTerm("");
    setCurrentPage(1);
  };

  const adminOptions = [
    { id: "all", name: "All" },
    ...availableAdmins, // [{ id: 1, name: 'Admin A' }, ...]
  ];

  return (
    <div className="pb-35 xl:pb-0">
      <TopNav />

      <div className="flex flex-col xl:flex-row flex-1 relative">
        <SideBar />
        <div className="flex-1 relative">
          <div className="pb-5 pt-8 px-7 flex flex-col gap-10 font-poppints xl:bg-white xl:gap-0 xl:px-5 xl:pt-5">
            <div className="hidden xl:flex justify-between w-full items-end p-5">
              <div className="flex flex-col">
                <p className="font-semibold text-3xl">Change History</p>
                <p>View changes in member details by admin</p>
              </div>
            </div>

            <div className="flex flex-col gap-8 xl:flex xl:border xl:border-black xl:mr-3 xl:mt-3 xl:mb-10 xl:rounded-lg xl:py-10">
              <div className="flex flex-col gap-5">
                <div className="flex flex-col space-y-5 text-center">
                  <div className="w-full flex flex-row gap-6 px-5 justify-between">
                    <input
                      type="text"
                      placeholder="Search Affected Member Name"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="border border-gray-300 rounded-md px-3 w-[35rem] focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                    />

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="font-normal text-md py-6 md:px-10 w-[22rem] flex justify-between items-center text-left hover:cursor-pointer"
                        >
                          Changed By: {_selectedAdmin?.name || "Select Admin"}
                          <BsArrowDown className="size-5 ml-3 mt-1" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        {adminOptions.map((admin) => (
                          <DropdownMenuItem
                            key={admin.id}
                            onClick={() => setSelectedAdmin(admin)}
                          >
                            {admin.name}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="font-normal text-md py-6 md:px-10 w-[22rem] flex justify-between items-center text-left hover:cursor-pointer"
                        >
                          {date ? (
                            `${date.from?.toLocaleDateString()} - ${date.to?.toLocaleDateString()}`
                          ) : (
                            <span className="text-gray-500">Date Range</span>
                          )}
                          <BsCalendar className="size-5 ml-3 mt-1" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <Calendar
                          mode="range"
                          selected={date}
                          onSelect={setDate}
                          numberOfMonths={1}
                        />
                      </PopoverContent>
                    </Popover>

                    <Button
                      onClick={handleResetFilters}
                      className="font-normal text-md px-5 py-6 bg-blue-button md:px-10 hover:cursor-pointer"
                    >
                      Reset Filters
                    </Button>
                  </div>

                  <div className="overflow-x-auto px-5">
                    <table className="min-w-full table-fixed borderrounded-lg text-sm text-left">
                      <thead className="font-semibold bg-blue-button">
                        <tr>
                          <th className="w-[22rem] py-3 px-4 text-white">
                            Date Changed
                          </th>
                          <th className="w-[22rem] py-3 px-4 text-white">
                            Admin
                          </th>
                          <th className="w-[22rem] py-3 px-4 text-white">
                            Member
                          </th>
                          <th className="w-[22rem] py-3 px-4 text-white">
                            Change Type
                          </th>
                          <th className="w-[22rem] py-3 px-4 text-white">
                            Field Changed
                          </th>
                          <th className="w-[22rem] py-3 px-4 text-white">
                            Past Value
                          </th>
                          <th className="w-[22rem] py-3 px-4 text-white">
                            New Value
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <tr>
                            <td className="py-3 px-4 text-center" colSpan="7">
                              Loading...
                            </td>
                          </tr>
                        ) : changedData.length === 0 ? (
                          <tr>
                            <td
                              className="py-3 px-4 text-center text-gray-500"
                              colSpan="7"
                            >
                              No change history found
                            </td>
                          </tr>
                        ) : (
                          changedData.map((row, index) => (
                            <tr key={index} className="border-b bg-gray-50">
                              <td className="py-3 px-4">
                                {row.date
                                  ? new Date(row.date).toLocaleDateString()
                                  : "N/A"}
                              </td>
                              <td className="py-3 px-4">
                                {row.changedBy || row.changed_by || "N/A"}
                              </td>
                              <td className="py-3 px-4">
                                {row.member || row.member_name || "N/A"}
                              </td>
                              {row.change_type === "Create" ? (
                                <td className="py-3 px-4 font-semibold">
                                  <span className="px-3 py-1 rounded-lg bg-blue-100">
                                    {row.change_type}
                                  </span>
                                </td>
                              ) : row.change_type === "Update" ? (
                                <td className="py-3 px-4 font-semibold">
                                  <span className="px-3 py-1 rounded-lg bg-yellow-100">
                                    {row.change_type}
                                  </span>
                                </td>
                              ) : row.change_type === "Add" ? (
                                <td className="py-3 px-4 font-semibold">
                                  <span className="px-3 py-1 rounded-lg bg-green-100">
                                    {row.change_type}
                                  </span>
                                </td>
                              ) : row.change_type === "Delete" ? (
                                <td className="py-3 px-4 font-semibold">
                                  <span className="px-3 py-1 rounded-lg bg-red-100">
                                    {row.change_type}
                                  </span>
                                </td>
                              ) : (
                                <td className="py-3 px-4 font-semibold">
                                  <span className="px-3 py-1 rounded-lg bg-gray-100">
                                    {row.change_type || "Unknown"}
                                  </span>
                                </td>
                              )}
                              <td className="py-3 px-4">
                                {row.field_changed || row.field || "N/A"}
                              </td>
                              <td className="py-3 px-4">
                                {row.past_value || row.old_value || "N/A"}
                              </td>
                              <td className="py-3 px-4">
                                {row.new_value || row.new_value || "N/A"}
                              </td>
                            </tr>
                          ))
                        )}

                        {!loading &&
                          changedData.length > 0 &&
                          Array.from({
                            length: Math.max(0, 10 - changedData.length),
                          }).map((_, i) => (
                            <tr key={`empty-${i}`} className="border-b">
                              <td
                                className="py-3 px-4 text-gray-300"
                                colSpan="7"
                              >
                                &nbsp;
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                    <div className="flex flex-row justify-between items-center mt-4">
                      <p className="text-gray-500 text-sm mt-2">
                        {changedData.length > 0
                          ? `${(currentPage - 1) * 10 + 1} - ${Math.min(currentPage * 10, totalRecords)} of ${totalRecords}`
                          : "0 - 0 of 0"}
                      </p>

                      <div className="flex items-center">
                        <SlArrowLeft
                          onClick={() =>
                            setCurrentPage((p) => Math.max(p - 1, 1))
                          }
                          className={`inline py-1 size-5 mr-3 hover:cursor-pointer border ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                        />
                        <span className="text-gray-500 text-sm">
                          {currentPage} / {totalPages}
                        </span>
                        <SlArrowRight
                          onClick={() =>
                            setCurrentPage((p) => Math.min(p + 1, totalPages))
                          }
                          className={`inline py-1 size-5 ml-3 hover:cursor-pointer border ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangesHistory;
