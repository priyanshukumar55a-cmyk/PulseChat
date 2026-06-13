import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import defaultAvatar from "@/assets/default-avatar.png";
import { Button } from "@/components/ui/button";

const ConnectedProfileModel = ({ user }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border-white/20 text-white px-4 py-5 bg-fuchsia-500 hover:cursor-pointer hover:bg-fuchsia-600 hover:text-black/65"
        >
          View Profile
        </Button>
      </DialogTrigger>
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

export default ConnectedProfileModel;
