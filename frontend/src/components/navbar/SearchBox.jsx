import React, { useRef, useState } from "react";
import api from "@/api/axios";
import { Search, X, Loader2 } from "lucide-react";
import UserListItem from "@/UserAvatar/UserListItem";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Command, CommandEmpty, CommandList } from "@/components/ui/command";
import { useChatAccess } from "./useChatAccess";
import { useNavigate } from "react-router-dom";

const SearchBox = () => {
  const navigate = useNavigate();
  const { accessChat, loadingChat } = useChatAccess();

  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const debounceRef = useRef(null);
  const inputRef = useRef(null);
  const [focused, setFocused] = useState(false);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!val) {
      setResults([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        setLoadingSearch(true);
        const { data } = await api.get("/user", { params: { search: val } });
        setResults(data || []);
      } catch (err) {
        setResults([]);
      } finally {
        setLoadingSearch(false);
      }
    }, 350);
  };

  const handleClear = () => {
    setSearch("");
    setResults([]);
  };

  const handleSelectUser = async (user) => {
    setSearch("");
    setResults([]);
    await accessChat(user._id || user.id);
    navigate("/chats");
  };
  const open = search.trim().length > 0 && (loadingSearch || results.length > 0);

  return (
    <Popover open={open}>
      <div className="w-full">
        <PopoverTrigger asChild>
          <div className="flex items-center w-full gap-2">
            <div className="relative flex-1">
              <input
                ref={inputRef}
                value={search}
                onChange={handleSearchChange}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="Search by name or email"
                autoComplete="new-password"
                spellCheck={false}
                className="w-full pr-9 px-3 h-10 rounded-xl bg-white/5 text-white placeholder:text-white/60 border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-300"
              />

              {/* Clear button: visible when input has text or when focused */}
              <button
                type="button"
                onClick={handleClear}
                aria-label="Clear search"
                className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md text-white/60 hover:text-white transition-opacity duration-150 ${
                  search.trim().length > 0 || focused
                    ? "opacity-100"
                    : "opacity-0 pointer-events-none"
                }`}
              >
                <X size={14} />
              </button>
            </div>

            <div className="p-2.5 rounded-lg bg-indigo-600 text-white inline-flex shrink-0 border-white/25 border-[0.2px]">
              {loadingChat || loadingSearch ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <Search size={16} />
              )}
            </div>
          </div>
        </PopoverTrigger>

        <PopoverContent
          onOpenAutoFocus={(e) => e.preventDefault()}
          align="start"
          sideOffset={8}
          className="w-[var(--radix-popover-trigger-width)] p-2 bg-black/80 backdrop-blur-xl border border-white/10"
        >
          <Command className="bg-transparent">
            <CommandList>
              {loadingSearch ? (
                <div className="p-3 text-sm text-white/70">Searching...</div>
              ) : results.length > 0 ? (
                results.slice(0, 6).map((u) => (
                  <div
                    key={u._id || u.id}
                    value={`${u.username} ${u.email}`}
                    onClick={() => handleSelectUser(u)}
                    className=" cursor-pointer rounded-xl bg-white/5 hover:bg-white/10 transition-colors my-2"
                  >
                    <UserListItem user={u} />
                  </div>
                ))
              ) : (
                <CommandEmpty className={"text-white"}>
                  No users found
                </CommandEmpty>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </div>
    </Popover>
  );
};

export default SearchBox;
