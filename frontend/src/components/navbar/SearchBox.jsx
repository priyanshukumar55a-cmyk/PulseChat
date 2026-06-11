import React, { useRef, useState } from "react";
import api from "@/api/axios";
import { Search } from "lucide-react";
import UserListItem from "@/UserAvatar/UserListItem";

const SearchBox = () => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const debounceRef = useRef(null);

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

  const handleSelectUser = (user) => {
    setSearch("");
    setResults([]);
    // navigate to chat or profile with user id; placeholder navigates to /profile
    navigate(`/profile/${user._id || user.id}`);
  };
  return (
    <div className="hidden sm:flex items-center mx-6 w-96 relative">
      <div className="flex items-center w-full gap-2">
        <input
          value={search}
          onChange={handleSearchChange}
          placeholder="Search users..."
          className="w-full px-3 py-2 rounded-xl bg-white/5 text-white placeholder:text-white/50 border border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-300"
        />
        <div className="p-2 rounded-lg bg-indigo-600 text-white hidden sm:inline-flex">
          <Search size={16} />
        </div>
      </div>

      {/* Dropdown results */}
      {search && (
        <div className="absolute top-full left-0 mt-2 w-86 bg-black/60 border border-white/10 rounded-lg p-2 z-50">
          {loadingSearch ? (
            <div className="text-sm text-white/70 p-2">Searching...</div>
          ) : results.length > 0 ? (
            results.slice(0, 6).map((u) => (
              <div
                key={u._id || u.id}
                className="w-full text-left px-2 py-2 hover:bg-white/5 rounded"
              >
                <UserListItem
                  key={u._id || u.id}
                  user={u}
                  handleFunction={() => handleSelectUser(u)}
                ></UserListItem>
              </div>
            ))
          ) : (
            <div className="text-sm text-white/60 p-2 text-center">
              No users found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBox;
