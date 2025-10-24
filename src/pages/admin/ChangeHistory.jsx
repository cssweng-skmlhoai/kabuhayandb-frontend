import TopNav from "@/components/AdminCompts/TopNav";
import React, { useState } from "react";
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

const ChangeHistory = () => {
  const [selectedAdmin, setSelectedAdmin] = useState("All");
  const [date, setDate] = useState();

  const changedData = [
    {
      id: 1,
      member: "John D",
      changedBy: "Jane",
      date: new Date("2023-01-01"),
      change_type: "Update",
      field_changed: "Contact Number",
      past_value: "09654321209",
      new_value: "09123456789",
    },
    {
      id: 2,
      member: "Alice S",
      changedBy: "John",
      date: new Date("2023-01-02"),
      change_type: "Add",
      field_changed: "Gender",
      past_value: "-",
      new_value: "Male",
    },
    {
      id: 3,
      member: "Sabrina C",
      changedBy: "Taylor",
      date: new Date("2023-01-03"),
      change_type: "Update",
      field_changed: "Middle Name",
      past_value: "Ann",
      new_value: "Annlyn",
    },
    {
      id: 4,
      member: "Lebron J.",
      changedBy: "Stephen",
      date: new Date("2023-01-06"),
      change_type: "Delete",
      field_changed: "Last Name",
      past_value: "James",
      new_value: "-",
    },
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
                      placeholder="Search Member Name"
                      className="border border-gray-300 rounded-md px-3 w-[35rem] focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                    />

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="font-normal text-md py-6 md:px-10 w-[22rem] flex justify-between items-center text-left hover:cursor-pointer"
                        >
                          Changed By
                          <BsArrowDown className="size-5 ml-3 mt-1" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        {["All", "Jane", "John", "Taylor"].map((admin) => (
                          <DropdownMenuItem
                            key={admin}
                            onClick={() => setSelectedAdmin(admin)}
                          >
                            {admin}
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

                    <Button className="font-normal text-md px-5 py-6 bg-blue-button md:px-10 hover:cursor-pointer">
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
                          <th className="w-[22rem]py-3 px-4 text-white">
                            New Value
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {changedData.map((row, index) => (
                          <tr key={index} className="border-b bg-gray-50">
                            <td className="py-3 px-4">
                              {row.date.toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4">{row.changedBy}</td>
                            <td className="py-3 px-4">{row.member}</td>
                            {row.change_type === "Add" ? (
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
                                <span className="px-3 py-1 rounded-lg bg-yellow-100">
                                  {row.change_type}
                                </span>
                              </td>
                            )}
                            <td className="py-3 px-4">{row.field_changed}</td>
                            <td className="py-3 px-4">{row.past_value}</td>
                            <td className="py-3 px-4">{row.new_value}</td>
                          </tr>
                        ))}

                        {Array.from({
                          length: Math.max(0, 10 - changedData.length),
                        }).map((_, i) => (
                          <tr key={`empty-${i}`} className="border-b">
                            <td className="py-3 px-4 text-gray-300" colSpan="7">
                              &nbsp;
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="flex flex-row justify-between items-center mt-4">
                      <p className="text-gray-500 text-sm mt-2">1 - 00 of 00</p>

                      <div className="flex items-center">
                        <SlArrowLeft className="inline py-1 size-5 mr-3 hover:cursor-pointer border" />
                        <span className="text-gray-500 text-sm">1 / 10</span>
                        <SlArrowRight className="inline py-1 size-5 ml-3 hover:cursor-pointer border" />
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

export default ChangeHistory;
