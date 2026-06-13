import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import defaultAvatar from "@/assets/default-avatar.png";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  User,
  Settings,
  LogOut,
  MessageCircle,
  ChevronDown,
} from "lucide-react";
import ProfileModal from "@/miscellaneous/ProfileModal";

const ProfileMenu = () => {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <div className="hover:cursor-pointer flex items-center gap-1 ml-2">
            <Avatar>
              <AvatarImage src={user?.pic || defaultAvatar} />
              <AvatarFallback>
                {user?.username?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <ChevronDown
              className={`h-4 w-4 text-white/60 transition-transform duration-200 ${
                open ? "rotate-180" : ""
              }`}
            />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-65 h-50 bg-black/65 backdrop-blur-xl border border-white/20 text-white"
        >
          <DropdownMenuLabel className="text-[16px] text-amber-300 text-center">
            {user?.username}
          </DropdownMenuLabel>
          <DropdownMenuSeparator className={"bg-white w-auto h-0.5"} />
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setOpen(false);
              setProfileOpen(true);
            }}
            className="text-[16px] text-white/75"
          >
            <User className="mr-2 h-6 w-6" />
            Profile
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => navigate("/chats")}
            className="text-[16px] text-white/75"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            My Chats
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => navigate("/settings")}
            className="text-[16px] text-white/75"
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>

          <DropdownMenuSeparator className={"bg-white w-auto h-0.5 mt-1"} />

          <DropdownMenuItem
            onClick={handleLogout}
            className="text-red-400 text-[18px] text-center justify-center py-1"
          >
            <LogOut className="h-10 w-10" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ProfileModal open={profileOpen} setOpen={setProfileOpen} />
    </>
  );
};

export default ProfileMenu;
