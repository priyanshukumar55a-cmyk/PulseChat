import { useAuth } from '@/context/AuthContext'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { User, Settings, LogOut, MessageCircle } from "lucide-react";

const ProfileMenu = () => {
    const { user, logOut } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logOut();
        navigate("/login")
    }

  return (
      <DropdownMenu>
          
    </DropdownMenu>
  )
}

export default ProfileMenu