import React, { useEffect, useState } from "react";
import TopNav from "@/components/AdminCompts/TopNav";
import Sidebar from "@/components/AdminCompts/Sidebar";
import { IoSearchOutline } from "react-icons/io5";
import { ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const SearchMember = ({ purpose }) => {
  const [members, setMembers] = useState([]);
  const [searched, setSearched] = useState("");
  const [searchSelected, setSearchSelected] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const membersPerPage = 5;
  const indexOfLastMember = currentPage * membersPerPage;
  const indexOfFirstMember = indexOfLastMember - membersPerPage;
  const currentMembers = members.slice(indexOfFirstMember, indexOfLastMember);
  const totalPages = Math.ceil(members.length / membersPerPage);

  const API_SECRET = import.meta.env.VITE_API_SECRET;
  const API_URL = "https://kabuhayandb-backend.onrender.com";

  const searchUser = () => {
    axios
      .get(`${API_URL}/members/home?name=${searched}`, {
        headers: {
          Authorization: `Bearer ${API_SECRET}`,
        },
      })
      .then((res) => {
        if (!res.data) {
          setMembers([]);
        } else {
          const results = Array.isArray(res.data) ? res.data : [res.data];
          setMembers(results);
          setCurrentPage(1);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <TopNav />

      <div className="flex flex-col xl:flex-row flex-1 relative">
        <Sidebar />
        <div className="flex-1 relative">
          <div className="py-5 px-7 flex flex-col gap-10 font-poppins xl:bg-white xl:gap-0 xl:px-5">
            <div className="hidden xl:flex justify-between w-full items-end p-5">
              {" "}
              {/* desktop only/separate component */}
              <div className="flex flex-col">
                <p className="font-semibold text-3xl">Search Member ({`${purpose === "dues" ? "Dues" : "Certification"}`})</p>
                <p>
                  {purpose === "dues" && (
                    <>
                      Check <span className="font-semibold">Monthly Dues Report</span> or{" "}
                    </>
                  )}
                  Select a Member to {purpose === "dues" ? "Manage" : "Issue"} their{" "}
                  <span className="font-semibold">
                    {purpose === "dues" ? "Dues" : "Certificate"}
                  </span>
                </p>
              </div>
              <Link to="/monthlyDuesReport">
                <Button className="font-normal px-10 py-6 bg-blue-button">Generate Monthly Dues Report</Button>
              </Link>
            </div>

            <div className="flex flex-col gap-5 xl:flex xl:border xl:border-black xl:mr-3 xl:mt-3 xl:mb-10 xl:rounded-lg xl:flex-col xl:px-60 xl:py-10">
              <div className="flex flex-col text-center xl:hidden">
                <p className="font-semibold text-2xl">Search Member ({`${purpose === "dues" ? "Dues" : "Certification"}`})</p>
                <p>
                  {purpose === "dues" && (
                    <>
                      Check <span className="font-semibold">Monthly Dues Report</span> or{" "}
                    </>
                  )}
                  Select a Member to {purpose === "dues" ? "Manage" : "Issue"} their{" "}
                  <span className="font-semibold">
                    {purpose === "dues" ? "Dues" : "Certificate"}
                  </span>
                </p>
              </div>

              <div className="relative">
                <IoSearchOutline
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 cursor-pointer size-5"
                  onClick={searchUser}
                />
                <input
                  type="text"
                  placeholder="Search Member Name"
                  className="border border-gray-300 bg-customgray2 rounded-md pl-10 pr-3 py-3 w-full"
                  value={searched}
                  onChange={(e) => setSearched(e.target.value)}
                />
              </div>

              {members.length === 0 ? (
                <p className="text-center text-gray-500 mt-4 bg-customgray2 py-4">Search for a Member.</p>
              ) : (
                currentMembers.map((member) => (
                  <Link
                    key={member.member_id}
                    to={`/${purpose}/${member.member_id}${purpose === "dues" ? `/${member.fullname}` : ""}`}
                    className="bg-customgray2 px-4 py-7 flex flex-col rounded-md hover:bg-customgray1 xl:relative xl:py-5 xl:mb-0 duration-200"
                  >

                    <p className="font-semibold text-lg ml-3">{member.fullname}</p>
                  </Link>
                ))
              )}

              <div className={`flex justify-between items-center mt-5 xl:mt-0 ${members.length <= membersPerPage ? "hidden" : ""}`}>
                <p className="text-sm text-gray-600">
                  {members.length === 0
                    ? "0 results"
                    : `${indexOfFirstMember + 1}-${Math.min(indexOfLastMember, members.length)} of ${members.length}`}
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`border border-gray-400 rounded hover:bg-gray-300 px-2 py-1 ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <ChevronLeft />
                  </button>
                  <p className="text-sm">
                    {currentPage}/{totalPages}
                  </p>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className={`border border-gray-400 rounded hover:bg-gray-300 px-2 py-1 ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <ChevronRight />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-customgray2 py-5 fixed bottom-0 w-full flex justify-center border-t border-black xl:hidden">
            <Link to="/monthlyDuesReport">
              <Button className="font-normal px-10 py-6 bg-blue-button">Generate Monthly Dues Report</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchMember