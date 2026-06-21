import { Bell, BellDot } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChatState } from "@/context/chatProvider";

export default function Notifications() {
  const { notifications, setSelectedChat, setNotifications } = ChatState();

  const handleNotificationClick = (notification) => {
    setSelectedChat(notification.chat);
    setNotifications((prev) =>
      prev.filter((noti) => noti._id !== notification._id),
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative p-2 rounded-lg hover:bg-white/10 transition hover:cursor-pointer">
          {notifications.length > 0 ? (
            <BellDot className="h-5 w-5 text-white" />
          ) : (
            <Bell className="h-5 w-5 text-white" />
          )}

          {notifications.length > 0 && (
            <span className="absolute top-0 right-0.75 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
              {notifications.length}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-80 bg-black/65 backdrop-blur-xl border border-white/10 text-white"
      >
        <DropdownMenuLabel className="text-[15px] text-white/60 text-center">
          Notifications
        </DropdownMenuLabel>

        <DropdownMenuSeparator className={"bg-white w-auto h-0.5"} />

        {notifications.length === 0 ? (
          <div className="p-4 text-sm text-white/60">No new notifications</div>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification._id}
              onClick={() => handleNotificationClick(notification)}
              className="cursor-pointer p-2"
            >
              {notification.chat.isGroupChat
                ? notification.chat.chatName
                : notification.sender.username}
              : {notification.content}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
