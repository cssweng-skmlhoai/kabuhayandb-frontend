import React, { useEffect, useState } from "react";
import { IoPersonCircleSharp } from "react-icons/io5";
import { BsThreeDots } from "react-icons/bs";
import { IoIosList } from "react-icons/io";
import { LuPencil } from "react-icons/lu";
import { TiDeleteOutline } from "react-icons/ti";
import { TbCancel } from "react-icons/tb";
import { FaPlus } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "@/authStore";
import SearchBar from "./SearchBar";
import Pagination from "./Pagination";
import ConfirmationDialog from "./ConfirmationDialog";
import { fetchMembers, handleDelete, searchUser } from "@/hooks/MemberListUtils";

const MembersList = () => {
  const navigate = useNavigate();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [members, setMembers] = useState([]);
  const [searched, setSearched] = useState("");
  const [memberToDeleteId, setMemberToDeleteId] = useState(null);
  const [memberToDeleteName, setMemberToDeleteName] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const membersPerPage = 5;
  const indexOfLastMember = currentPage * membersPerPage;
  const indexOfFirstMember = indexOfLastMember - membersPerPage;
  const currentMembers = members.slice(indexOfFirstMember, indexOfLastMember);

  const { memberId, logout } = useAuthStore();

  useEffect(() => {
    fetchMembers(setMembers);
  }, []);

  return (
    <div>
      <div className="px-5 pb-4 pt-8 bg-customgray1 flex flex-col items-center justify-center gap-4 font-poppins xl:bg-white xl:flex-row xl:px-10 xl:pt-10 xl:pb-5">
        <div className="hidden xl:flex justify-between w-full items-end">
          <div className="flex flex-col">
            <p className="font-semibold text-3xl">All Members</p>
            <p>View and Edit Member Details</p>
          </div>
          <div className="flex gap-3">
            <Button className="bg-blue-button py-6">
              <Link to="/members/add" className="flex items-center gap-2">
                <FaPlus />
                Add Member
              </Link>
            </Button>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3 w-[90%] xl:hidden">
          <SearchBar value={searched} onChange={setSearched} onSearch={() => searchUser(searched, setMembers, setCurrentPage)} />
          <p className="text-sm italic text-gray-500">Note: Empty the search bar and press 'Search' to show all members</p>
        </div>
      </div>

      <div className="px-8 py-6 xl:border xl:border-black xl:mr-10 xl:mt-3 xl:ml-5 xl:mb-10 xl:rounded-lg xl:flex xl:flex-col xl:gap-7">
        <div className="hidden xl:flex flex-col justify-between gap-3">
          <SearchBar variant="compact" value={searched} onChange={setSearched} onSearch={() => searchUser(searched, setMembers, setCurrentPage)} memList />
          <p className="text-sm italic text-gray-400">Note: Empty the search bar and press 'Search' to show all members</p>
        </div>

        {members.length === 0 ? (
          <p className="text-center text-gray-500 mt-4">No members found.</p>
        ) : (
          currentMembers.map((member) => (
            <div
              key={member.member_id}
              className="bg-customgray2 px-4 pb-4 pt-3 flex flex-col mb-7 xl:rounded-md xl:relative xl:py-5 xl:mb-0"
            >
              <div className="flex justify-end xl:absolute xl:right-4 xl:-translate-y-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="cursor-pointer">
                      <BsThreeDots className="size-6 rounded hover:bg-gray-300" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Link
                        to={`/members/${member.member_id}`}
                        className="flex items-center gap-2"
                      >
                        <IoIosList />
                        View Details
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link
                        to={`/members/${member.member_id}/edit`}
                        className="flex items-center gap-2"
                      >
                        <LuPencil />
                        Edit Details
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setDialogOpen(true);
                        setMemberToDeleteId(member.member_id);
                        setMemberToDeleteName(member.fullname);
                      }}
                    >
                      <TiDeleteOutline />
                      Delete Member
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <TbCancel />
                      Cancel
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex justify-between items-center font-poppins">
                <div className="flex items-center gap-4">
                  {member?.pfp ? (
                    <img
                      src={typeof member.pfp === "string"
                        ? member.pfp
                        : URL.createObjectURL(member.pfp)}
                      alt="Profile"
                      loading="lazy"
                      className="hidden xl:block size-14 rounded-full bg-gray-300 object-cover"
                    />
                  ) : (
                    <IoPersonCircleSharp className="hidden xl:block size-15 text-gray-400" />
                  )}

                  <div className="flex flex-col gap-1.5">
                    <p className="font-semibold">{member.fullname}</p>
                    <div className="xl:flex gap-20">
                      <p>{member.tct_no}</p>
                      <p>
                        BLK {member.block_no} • LOT {member.lot_no}
                      </p>
                    </div>
                  </div>
                </div>
                <p className="px-3 py-0.5 bg-white rounded-md mr-[8%] xl:mr-[12%]">
                  {member.head_position || "N/A"}
                </p>
              </div>
            </div>
          ))
        )}

        <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalItems={members.length} itemsPerPage={membersPerPage} showRange />
      </div>

      {/* Dialog for delete member confirmation */}
      <ConfirmationDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        title={"Delete This Member?"}
        description={<>
          All records related to <span className="font-bold">{memberToDeleteName}</span> will be permanently deleted from the database, including their family members, their household, dues, and credentials.
        </>}
        confirmText="Delete"
        confirmColor="bg-red-700"
        onConfirm={() => handleDelete(memberToDeleteId, setMembers, setDialogOpen, memberId, logout, navigate)}
        confirmHover="hover:bg-red-900"
      />
    </div>
  );
};

export default MembersList;
