import { Divide, Search } from "lucide-react"
import { useState } from "react";

const SideDrawer = () => {
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingChat, setLoadingChat] = useState()

    const handleSearchChange = (e) => {
        setSearch(e.target.value)
        // TODO: call backend to fetch matching users and update searchResult
    }

    return (
        <div className="mt-20 ml-4 md:ml-6 w-full md:w-96 lg:w-80">
            
        </div>
    )
}

export default SideDrawer;

// {/* <div className="p-3 bg-white/5 backdrop-blur rounded-lg border border-white/10 shadow-sm">
//   <label className="text-sm text-white/80 mb-2 block">Search Users</label>

//   <div className="flex items-center gap-2">
//     <input
//       value={search}
//       onChange={handleSearchChange}
//       placeholder="Search users by name or email..."
//       className="w-full px-3 py-2 rounded-lg bg-white/5 text-white placeholder:text-white/50 border border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
//     />

//     <button
//       onClick={() => {
//         /* trigger search action if needed */
//       }}
//       className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white"
//       aria-label="Search"
//     >
//       <Search size={18} />
//     </button>
//   </div>

//   <div className="mt-3 max-h-60 overflow-auto">
//     {loading ? (
//       <div className="text-sm text-white/70">Searching...</div>
//     ) : searchResult.length > 0 ? (
//       searchResult.map((user) => (
//         <div
//           key={user._id || user.id}
//           className="py-2 flex items-center justify-between border-b border-white/5"
//         >
//           <div className="text-sm text-white/90">{user.name || user.email}</div>
//         </div>
//       ))
//     ) : (
//       <div className="text-sm text-white/60">No users found</div>
//     )}
//   </div>
// </div>; */}