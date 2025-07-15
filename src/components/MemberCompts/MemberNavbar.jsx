import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Settings, LogOut } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import "./MemberNavbar.css";
import useAuthStore from "@/authStore";

const MemberNavbar = ({ member }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="navbar">
      <div className="section">
        <div className="top-section">
          <div className="left-side">
            <Avatar>
              <AvatarImage src="/SKMLHOAI_Logo.png" />
            </Avatar>
            <span className="greeting"> Mabuhay, {member?.first_name || "member"}!</span>
          </div>
          <div className="actions">
            <div className="icon-label">
              <Settings />
              <span>Settings</span>
            </div>
            <div className="icon-label" onClick={handleLogout}>
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
            <TabsTrigger value="/memberView">Household Members</TabsTrigger>
            <TabsTrigger value="/memberView/housing-utilities">Housing & Utilities</TabsTrigger>
            <TabsTrigger value="/memberView/dues">Dues</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};

export default MemberNavbar;
