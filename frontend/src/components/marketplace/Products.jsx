import { useState } from "react";
import { useStamps } from "../../queries/stampsQuery.js";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import FilterDrawer from "./FilterDrawer";
import StampCard from "./StampCard";
import LoadingSpinner from "./LoadingSpinner";

export default function Products() {
    const [filters, setFilters] = useState({
        search: "",
        sort: "",
        sortBy: "",
        categories: [],
        forSale: true,
        isMuseumPiece: false,
        page: 1,
        limit: 12
    });

    const { data, isFetching, error } = useStamps(filters);
    const [searchInput, setSearchInput] = useState("");

    const handleSearch = () => {
        setFilters(prev => ({ 
            ...prev, 
            search: searchInput,
            page: 1 // Reset to first page on new search
        }));
    };

    const handleSearchInputChange = (value) => {
        setSearchInput(value);
        // Optional: Real-time search with debouncing
        if (!value.trim()) {
            setFilters(prev => ({ ...prev, search: "", page: 1 }));
        }
    };

    const handleFilterChange = (newFilters) => {
        setFilters(prev => ({ 
            ...prev, 
            ...newFilters,
            page: 1 // Reset to first page when filters change
        }));
    };

    const handleClearFilters = () => {
        setFilters({
            search: "",
            sort: "",
            sortBy: "",
            categories: [],
            forSale: true,
            isMuseumPiece: false,
            page: 1,
            limit: 12
        });
        setSearchInput("");
    };

    const handlePageChange = (newPage) => {
        setFilters(prev => ({ ...prev, page: newPage }));
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <section className="w-full">
            {/* Header and Filters */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-gray-50 border-b">
                <div className="flex items-center gap-4">
                    <FilterDrawer 
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onClearFilters={handleClearFilters}
                    />
                    <span className="text-sm text-gray-600">
                        {data?.total ? `${data.total} stamps found` : ''}
                    </span>
                </div>
                
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-80">
                        <Input
                            type="search"
                            placeholder="Search by title or description..."
                            className="pr-10"
                            value={searchInput}
                            onChange={(e) => handleSearchInputChange(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                        <Button
                            size="sm"
                            variant="ghost"
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                            onClick={handleSearch}
                        >
                            <Search className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Active Filters Display */}
            {(filters.search || filters.sort || filters.categories.length > 0 || 
              filters.forSale !== undefined || filters.isMuseumPiece !== undefined) && (
                <div className="p-4 bg-blue-50 border-b">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">Active filters:</span>
                        
                        {filters.search && (
                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                                Search: "{filters.search}"
                            </span>
                        )}
                        
                        {filters.sort && (
                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                                Sort: {filters.sortBy} ({filters.sort})
                            </span>
                        )}
                        
                        {filters.categories.length > 0 && (
                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                                Categories: {filters.categories.join(', ')}
                            </span>
                        )}
                        
                        {/* {filters.forSale !== undefined && (
                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                                For Sale: {filters.forSale ? 'Yes' : 'No'}
                            </span>
                        )}
                        
                        {filters.isMuseumPiece !== undefined && (
                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                                Museum Piece: {filters.isMuseumPiece ? 'Yes' : 'No'}
                            </span>
                        )} */}
                        
                        <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={handleClearFilters}
                            className="text-xs"
                        >
                            Clear All
                        </Button>
                    </div>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="p-4 m-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600">Error loading stamps: {error.message}</p>
                </div>
            )}

            {/* Loading State */}
            {isFetching && <LoadingSpinner />}

            {/* Products Grid */}
            {!isFetching && data?.stamps && (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
                        {data.stamps.length > 0 ? (
                            data.stamps.map((stamp) => (
                                <StampCard key={stamp.id} stamp={stamp} />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12">
                                <p className="text-gray-500 text-lg">No stamps found matching your criteria</p>
                                <Button 
                                    variant="outline" 
                                    onClick={handleClearFilters}
                                    className="mt-4"
                                >
                                    Clear Filters
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {data.stamps.length > 0 && data.totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 p-4 border-t">
                            <Button
                                variant="outline"
                                disabled={filters.page <= 1}
                                onClick={() => handlePageChange(filters.page - 1)}
                            >
                                Previous
                            </Button>
                            
                            <span className="px-4 py-2 text-sm">
                                Page {filters.page} of {data.totalPages}
                            </span>
                            
                            <Button
                                variant="outline"
                                disabled={filters.page >= data.totalPages}
                                onClick={() => handlePageChange(filters.page + 1)}
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </>
            )}
        </section>
    );
}