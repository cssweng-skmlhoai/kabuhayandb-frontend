import React from "react";
import { GoPeople } from "react-icons/go";
import { PiWallet } from "react-icons/pi";
import { GrDocumentUser } from "react-icons/gr";
import { SlSettings } from "react-icons/sl";
import { MdOutlineLogout } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import useAuthStore from "@/authStore";

const TopNav = () => {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white shadow-md border-t border-gray-500 z-50 xl:hidden">
      <nav className="px-3 py-4">
        <ul className="flex justify-around items-center">
          <li>
            <Link to="/members">
              <div className="flex flex-col items-center justify-center hover:bg-gray-300 p-1 rounded-sm cursor-pointer">
                <GoPeople className="size-6" />
                <p className="font-poppins text-sm">Members</p>
              </div>
            </Link>
          </li>
          <li>
            <Link to="/searchMemberDues">
              <div className="flex flex-col items-center justify-center hover:bg-gray-300 p-1 rounded-sm cursor-pointer">
                <PiWallet className="size-6" />
                <p className="font-poppins text-sm">Dues</p>
              </div>
            </Link>
          </li>
          <li>
            <Link to="/searchMemberCert">
              <div className="flex flex-col items-center justify-center hover:bg-gray-300 p-1 rounded-sm cursor-pointer">
                <GrDocumentUser className="size-6" />
                <p className="font-poppins text-sm">Certification</p>
              </div>
            </Link>
          </li>
          <li>
            <Link to="/settings">
              <div className="flex flex-col items-center justify-center hover:bg-gray-300 p-1 rounded-sm cursor-pointer">
                <SlSettings className="size-6" />
                <p className="font-poppins text-sm">Settings</p>
              </div>
            </Link>
          </li>
          <li>
            <Dialog>
              <DialogTrigger>
                <div className="flex flex-col items-center justify-center hover:bg-gray-300 p-1 rounded-sm cursor-pointer">
                  <MdOutlineLogout className="size-6" />
                  <p className="font-poppins text-sm">Logout</p>
                </div>
              </DialogTrigger>
              <DialogContent className="w-[80%]">
                <DialogHeader>
                  <DialogTitle className="text-left">
                    Are you Sure You Want to Logout?
                  </DialogTitle>
                </DialogHeader>
                <DialogDescription></DialogDescription>
                <DialogFooter className="flex flex-row justify-between gap-4">
                  <Button
                    className="w-1/2 bg-red-700 hover:bg-red-900 py-6 font-normal text-md"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                  <DialogClose className="w-1/2 bg-black rounded-md text-white cursor-pointer hover:bg-gray-900 duration-200">
                    Cancel
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default TopNav;
