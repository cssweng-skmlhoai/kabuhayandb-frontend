import TopNav from "@/components/AdminCompts/TopNav";
import React from "react";
import SideBar from "@/components/AdminCompts/SideBar";

const ChangeHistory = () => {
  return (
    <div className="pb-35 xl:pb-0 bg-customgray1">
      <TopNav />

      <div className="flex flex-col xl:flex-row flex-1 relative">
        <SideBar />

        <div className="flex-1 relative">
          <div className="pb-5 pt-8 px-7 flex flex-col gap-10 font-poppints xl:bg-white xl:gap-0 xl:px-5 xl:pt-5">
            <div className="flex flex-col">
              <p className="font-semibold text-3xl">Change History</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeHistory;
