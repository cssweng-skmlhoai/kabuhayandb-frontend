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

const ChangeHistory = () => {
  const [selectedAdmin, setSelectedAdmin] = useState("All");
  const [date, setDate] = useState();

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
                <div className="flex flex-col text-center">
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
