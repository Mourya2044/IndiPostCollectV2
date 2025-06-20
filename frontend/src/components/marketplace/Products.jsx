import { useState } from "react";
import { useStamps } from "../../queries/stampsQuery.js";
import Input from "../inputs/Input.jsx";
import { Search } from "lucide-react";

export default function Products() {
    const [filters, setFilters] = useState({});
    const { data, isFetching } = useStamps(filters);

    return (
        <section className="w-full  bg-IPClight-bg">
            <div className="flex justify-around p-4 h-15 items-center">
                <form name="filterForm" className="text-black flex gap-4">
                    <label htmlFor="category" className="label">Categories</label>
                    <input type="text" name="category" id="category" className="border-b-2 border-IPCaccent active:border-IPCsecondary" />

                    <label htmlFor="sortBy" className="label">Sort By</label>
                    <input type="text" name="sortBy" id="sortBy" className="border-b-2 border-IPCaccent active:border-IPCsecondary" />

                    <label htmlFor="sort" className="label">Sort</label>
                    <select name="sort" id="sort" className="">
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                    <button className="btn btn-md btn-outline rounded-none" onClick={() => setFilters({ ...filters, search: document.getElementById('search').value })}>
                        Filter
                    </button>
                    <button className="btn btn-md btn-outline rounded-none btn-error" onClick={() => setFilters({ ...filters, search: document.getElementById('search').value })}>
                        Clear
                    </button>
                </form>
                <div className="text-black flex gap-4 items-center">
                    <input type="search" name="search" id="Search" placeholder="search" className="self-end border-b-2 border-IPCaccent active:border-IPCsecondary" />
                    <button className="btn btn-md btn-outline rounded-none" onClick={() => setFilters({ ...filters, search: document.getElementById('Search').value })}>
                        <Search /> Search
                    </button>
                </div>
            </div>
        </section>
    );
}
