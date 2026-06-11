import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import defaultAvatar from "@/assets/default-avatar.png";
import { useAuth } from '@/context/AuthContext';

const ProfileModal = ({ open, setOpen }) => {
  const { user } = useAuth();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-black/60 backdrop-blur-2xl border border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>Profile</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-4">
          <Avatar className="h-28 w-28">
            <AvatarImage src={user?.pic || defaultAvatar} />
            <AvatarFallback>
              {user?.username?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <h2 className="text-2xl font-bold">{user?.username}</h2>
          <p className="text-white/60">{user?.email}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal