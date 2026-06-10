import { Bell, BellDot } from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Notifications() {
  const navigate = useNavigate();

  // Dummy notifications for now
  const notifications = [
    {
      id: 1,
      message: "Rahul sent you a message",
      chatId: "123",
    },
    {
      id: 2,
      message: "Priya mentioned you",
      chatId: "456",
    },
  ];

  const handleNotificationClick = (notification) => {
    navigate(`/chats/${notification.chatId}`);
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
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
              {notifications.length}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-80 bg-black/65 backdrop-blur-xl border border-white/10 text-white"
      >
          <DropdownMenuLabel className="text-[14px] text-white/60 text-center">
            Notifications
          </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {notifications.length === 0 ? (
          <div className="p-4 text-sm text-white/60">No new notifications</div>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              className="cursor-pointer"
            >
              {notification.message}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
