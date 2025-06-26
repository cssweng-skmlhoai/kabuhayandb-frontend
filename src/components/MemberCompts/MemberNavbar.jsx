import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Settings, LogOut } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import "./MemberNavbar.css";

const MemberNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="navbar">
      <div className="section">
        <div className="top-section">
          <div className="left-side">
            <Avatar>
              <AvatarImage src="https://cdn.pfps.gg/pfps/2301-default-2.png" />
            </Avatar>
            <span className="greeting"> Mabuhay, name!</span>
          </div>
          <div className="actions">
            <div className="icon-label">
              <Settings />
              <span>Settings</span>
            </div>
            <div className="icon-label">
              <LogOut />
              <span>Log Out</span>
            </div>
          </div>
        </div>
      </div>

      <Separator className="separator" />

      <div className="bottom-section">
        <Tabs
          className="w-fit"
          value={location.pathname}
          onValueChange={(path) => navigate(path)}
        >
          <TabsList className="w-fit">
            <TabsTrigger value="/members">Household Members</TabsTrigger>
            <TabsTrigger value="/members/housing-utilities">
              Housing & Utilities
            </TabsTrigger>
            <TabsTrigger value="/members/dues">Dues</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};

export default MemberNavbar;