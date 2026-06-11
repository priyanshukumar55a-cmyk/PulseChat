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