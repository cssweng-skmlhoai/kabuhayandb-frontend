import React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Settings, LogOut } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ConfirmDialog from "./ConfirmDialog";
import "./MemberNavbar.css";
import useAuthStore from "@/authStore";

const MemberNavbar = ({ member }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, pfp } = useAuthStore();

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
              <AvatarImage src={pfp || "/SKMLHOAI_Logo.png"} alt="Profile"/>
            </Avatar>
            <span className="greeting"> Mabuhay, {member?.first_name || "member"}!</span>
          </div>
          <div className="actions">
            <Link to="/settings" className="icon-label">
              <Settings />
              <span>Settings</span>
            </Link>
            <div>
              <ConfirmDialog
                title="Are you sure you want to logout?"
                onConfirm={handleLogout}
                trigger={
                  <div className="icon-label">
                    <LogOut />
                    <span>Log Out</span>
                  </div>
                }
              />
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
