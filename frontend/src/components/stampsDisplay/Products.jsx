import { useState } from "react";
import { useStamps } from "../../queries/stampsQuery.js";
import { Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import FilterDrawer from "./FilterDrawer";
import StampCard from "./StampCard";
import LoadingSpinner from "../LoadingSpinner.jsx";

export default function Products({ isMuseumPiece }) {
    const [filters, setFilters] = useState({
        search: "",
        sort: "",
        sortBy: "",
        categories: [],
        forSale: !isMuseumPiece,
        isMuseumPiece: isMuseumPiece,
        page: 1,
        limit: 12
    });

    const { data, isFetching, error } = useStamps(filters);
    const [searchInput, setSearchInput] = useState("");

    const handleSearch = () => {
        setFilters(prev => ({ ...prev, search: searchInput, page: 1 }));
    };

    const handleSearchInputChange = (value) => {
        setSearchInput(value);
        if (!value.trim()) {
            setFilters(prev => ({ ...prev, search: "", page: 1 }));
        }
    };

    const handleFilterChange = (newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
    };

    const handleClearFilters = () => {
        setFilters({
            search: "",
            sort: "",
            sortBy: "",
            categories: [],
            condition: [],
            minPrice: "",
            maxPrice: "",
            minYear: "",
            maxYear: "",
            forSale: !isMuseumPiece,
            isMuseumPiece: isMuseumPiece,
            page: 1,
            limit: 12
        });
        setSearchInput("");
    };

    const handlePageChange = (newPage) => {
        setFilters(prev => ({ ...prev, page: newPage }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const activeChips = [
        filters.search && { key: 'search', label: `"${filters.search}"` },
        filters.sort && filters.sortBy && { key: 'sort', label: `${filters.sortBy} (${filters.sort})` },
        filters.historicalPeriod && {
            key: 'period',
            label: filters.historicalPeriod === 'pre-independence'
                ? 'Period: Pre-Independence (≤1947)'
                : 'Period: Post-1947 Republic'
        },
        ...(filters.categories || []).map(c => ({ key: `cat-${c}`, label: c })),
        ...(filters.condition || []).map(c => ({ key: `cond-${c}`, label: `Condition: ${c}` })),
        (filters.minPrice || filters.maxPrice) && {
            key: 'price',
            label: `Price: ₹${filters.minPrice || '0'} – ₹${filters.maxPrice || '∞'}`
        },
        (filters.minYear || filters.maxYear) && {
            key: 'year',
            label: `Year: ${filters.minYear || 'Any'} – ${filters.maxYear || 'Now'}`
        },
    ].filter(Boolean);

    const removeChip = (key) => {
        if (key === 'search') { setFilters(p => ({ ...p, search: '', page: 1 })); setSearchInput(''); }
        else if (key === 'sort') setFilters(p => ({ ...p, sort: '', sortBy: '', page: 1 }));
        else if (key === 'period') setFilters(p => ({ ...p, historicalPeriod: '', page: 1 }));
        else if (key.startsWith('cat-')) {
            const cat = key.replace('cat-', '');
            setFilters(p => ({ ...p, categories: (p.categories || []).filter(c => c !== cat), page: 1 }));
        }
        else if (key.startsWith('cond-')) {
            const cond = key.replace('cond-', '');
            setFilters(p => ({ ...p, condition: (p.condition || []).filter(c => c !== cond), page: 1 }));
        }
        else if (key === 'price') {
            setFilters(p => ({ ...p, minPrice: '', maxPrice: '', page: 1 }));
        }
        else if (key === 'year') {
            setFilters(p => ({ ...p, minYear: '', maxYear: '', page: 1 }));
        }
    };

    return (
        <section id="collection" className="w-full">

            {/* ── Toolbar ── */}
            <div className="sticky top-16 z-30 bg-background border-b border-border">
                <div className="max-w-7xl mx-auto px-6 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    
                    {/* Left: filter + count */}
                    <div className="flex items-center gap-4">
                        <FilterDrawer
                            filters={filters}
                            onFilterChange={handleFilterChange}
                            onClearFilters={handleClearFilters}
                        />
                        {data?.total != null && (
                            <span className="text-xs text-muted-foreground">
                                <span className="font-semibold text-foreground">{data.total}</span> stamps
                            </span>
                        )}
                    </div>

                    {/* Right: search */}
                    <div className="relative w-full sm:w-72">
                        <input
                            type="search"
                            placeholder="Search stamps..."
                            value={searchInput}
                            onChange={(e) => handleSearchInputChange(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            className="w-full pl-4 pr-10 py-2 text-sm bg-background border border-border focus:outline-none focus:border-IPCprimary focus:ring-1 focus:ring-IPCprimary transition-all placeholder:text-muted-foreground"
                        />
                        <button
                            onClick={handleSearch}
                            className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-IPCprimary transition-colors"
                        >
                            <Search className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Active filter chips */}
                {activeChips.length > 0 && (
                    <div className="max-w-7xl mx-auto px-6 pb-3 flex flex-wrap items-center gap-2">
                        <span className="text-[10px] text-muted-foreground uppercase tracking-widest mr-1">Active:</span>
                        {activeChips.map(chip => (
                            <button
                                key={chip.key}
                                onClick={() => removeChip(chip.key)}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider border border-IPCprimary text-IPCprimary hover:bg-IPCprimary hover:text-white transition-all"
                            >
                                {chip.label}
                                <X className="h-3 w-3" />
                            </button>
                        ))}
                        <button
                            onClick={handleClearFilters}
                            className="text-[10px] text-muted-foreground hover:text-IPCsecondary uppercase tracking-widest transition-colors ml-1"
                        >
                            Clear all
                        </button>
                    </div>
                )}
            </div>

            {/* ── Error ── */}
            {error && (
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="border border-IPCsecondary/30 bg-IPCsecondary/5 px-4 py-3 text-sm text-IPCsecondary">
                        Error loading stamps: {error.message}
                    </div>
                </div>
            )}

            {/* ── Loading ── */}
            {isFetching && (
                <div className="flex items-center justify-center py-24">
                    <LoadingSpinner />
                </div>
            )}

            {/* ── Grid ── */}
            {!isFetching && data?.stamps && (
                <>
                    {data.stamps.length > 0 ? (
                        <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-border">
                            {data.stamps.map((stamp) => (
                                <div key={stamp._id} className="bg-background">
                                    <StampCard stamp={stamp} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-28 gap-5 text-center">
                            <div className="w-16 h-16 border-2 border-border flex items-center justify-center text-muted-foreground">
                                <Search className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-base font-semibold text-foreground">No stamps found</p>
                                <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters or search terms.</p>
                            </div>
                            <button
                                onClick={handleClearFilters}
                                className="px-5 py-2 border border-IPCprimary text-IPCprimary text-xs font-semibold uppercase tracking-widest hover:bg-IPCprimary hover:text-white transition-all"
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}

                    {/* ── Pagination ── */}
                    {data.stamps.length > 0 && data.totalPages > 1 && (
                        <div className="max-w-7xl mx-auto px-6 py-8 border-t border-border flex items-center justify-between gap-4">
                            <button
                                disabled={filters.page <= 1}
                                onClick={() => handlePageChange(filters.page - 1)}
                                className="inline-flex items-center gap-2 px-4 py-2 border border-border text-xs font-semibold uppercase tracking-widest hover:border-IPCprimary hover:text-IPCprimary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="h-3.5 w-3.5" /> Prev
                            </button>

                            <div className="flex items-center gap-1">
                                {Array.from({ length: data.totalPages }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`w-8 h-8 text-xs font-semibold transition-all ${
                                            page === filters.page
                                                ? 'bg-IPCprimary text-white'
                                                : 'border border-border hover:border-IPCprimary hover:text-IPCprimary'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>

                            <button
                                disabled={filters.page >= data.totalPages}
                                onClick={() => handlePageChange(filters.page + 1)}
                                className="inline-flex items-center gap-2 px-4 py-2 border border-border text-xs font-semibold uppercase tracking-widest hover:border-IPCprimary hover:text-IPCprimary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                Next <ChevronRight className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    )}
                </>
            )}
        </section>
    );
}