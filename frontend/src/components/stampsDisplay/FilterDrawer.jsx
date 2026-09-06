import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import {
    RadioGroup,
    RadioGroupItem,
} from "@/components/ui/radio-group";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { SlidersHorizontal, X } from "lucide-react";
import { useStampFilterMeta } from "@/queries/stampsQuery";

const DEFAULT_CATEGORIES = [
    "Historical",
    "Commemorative",
    "Flora & Fauna",
    "Monuments",
    "Freedom Fighters",
    "Aviation",
    "Definitive",
    "Art & Culture"
];

const DEFAULT_CONDITIONS = ["Mint", "Used", "First Day Cover", "Damaged"];

const HISTORICAL_PERIODS = [
    { value: "", label: "All Eras" },
    { value: "pre-independence", label: "Pre-Independence (≤ 1947)" },
    { value: "post-independence", label: "Post-1947 Republic" }
];

const SORT_OPTIONS = [
    { value: "title", label: "Title" },
    { value: "price", label: "Price" },
    { value: "year", label: "Year of Issue" },
    { value: "createdAt", label: "Date Added" }
];

export default function FilterDrawer({ filters, onFilterChange, onClearFilters }) {
    const { data: meta } = useStampFilterMeta();
    const [localFilters, setLocalFilters] = useState(filters);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setLocalFilters(filters);
    }, [filters]);

    const availableCategories = meta?.categories?.length > 0 ? meta.categories : DEFAULT_CATEGORIES;
    const availableConditions = meta?.conditions?.length > 0 
        ? Array.from(new Set([...meta.conditions, "Mint", "Used", "First Day Cover"]))
        : DEFAULT_CONDITIONS;

    const handleApplyFilters = () => {
        onFilterChange(localFilters);
        setIsOpen(false);
    };

    const handleClearAll = () => {
        const clearedFilters = {
            search: "",
            sort: "",
            sortBy: "",
            categories: [],
            condition: [],
            historicalPeriod: "",
            minPrice: "",
            maxPrice: "",
            minYear: "",
            maxYear: "",
            forSale: filters.forSale,
            isMuseumPiece: filters.isMuseumPiece,
            page: 1,
            limit: 12
        };
        setLocalFilters(clearedFilters);
        onClearFilters();
        setIsOpen(false);
    };

    const handleCategoryToggle = (categoryValue, checked) => {
        setLocalFilters(prev => ({
            ...prev,
            categories: checked
                ? [...(prev.categories || []), categoryValue]
                : (prev.categories || []).filter(cat => cat !== categoryValue)
        }));
    };

    const handleConditionToggle = (condValue, checked) => {
        setLocalFilters(prev => ({
            ...prev,
            condition: checked
                ? [...(prev.condition || []), condValue]
                : (prev.condition || []).filter(c => c !== condValue)
        }));
    };

    const handlePeriodChange = (periodValue) => {
        setLocalFilters(prev => ({
            ...prev,
            historicalPeriod: periodValue
        }));
    };

    const activeFilterCount = [
        filters.search,
        filters.sort,
        filters.historicalPeriod,
        filters.categories?.length > 0,
        filters.condition?.length > 0,
        filters.minPrice || filters.maxPrice,
        filters.minYear || filters.maxYear
    ].filter(Boolean).length;

    return (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
            <DrawerTrigger asChild>
                <button className="relative inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-widest border border-border text-foreground hover:border-IPCprimary hover:text-IPCprimary transition-all duration-200 cursor-pointer">
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                    Filter
                    {activeFilterCount > 0 && (
                        <span className="absolute -top-2 -right-2 h-4 w-4 flex items-center justify-center bg-IPCsecondary text-white text-[9px] font-bold">
                            {activeFilterCount}
                        </span>
                    )}
                </button>
            </DrawerTrigger>

            <DrawerContent className="max-h-[92vh] bg-background border-t border-border">
                <div className="mx-auto w-full max-w-3xl">
                    <DrawerHeader className="border-b border-border pb-4">
                        <DrawerTitle className="text-lg font-semibold text-IPCprimary tracking-tight">
                            Advanced Philatelic Filters
                        </DrawerTitle>
                        <DrawerDescription className="text-xs text-muted-foreground">
                            Filter authentic stamp issues by era, condition, historical period, and price range.
                        </DrawerDescription>
                    </DrawerHeader>

                    <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">

                        {/* Sort Controls */}
                        <div className="space-y-3">
                            <p className="text-xs font-semibold uppercase tracking-widest text-IPCprimary border-b border-border pb-1.5">
                                Sort By
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Field</Label>
                                    <Select
                                        value={localFilters.sortBy || "createdAt"}
                                        onValueChange={(v) => setLocalFilters(p => ({ ...p, sortBy: v }))}
                                    >
                                        <SelectTrigger className="border-border focus:border-IPCprimary text-xs">
                                            <SelectValue placeholder="Select field" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {SORT_OPTIONS.map(o => (
                                                <SelectItem key={o.value} value={o.value} className="text-xs">{o.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Order</Label>
                                    <RadioGroup
                                        value={localFilters.sort || "desc"}
                                        onValueChange={(v) => setLocalFilters(p => ({ ...p, sort: v }))}
                                        className="flex gap-6 pt-1"
                                    >
                                        {[{ value: "asc", label: "Ascending" }, { value: "desc", label: "Descending" }].map(o => (
                                            <div key={o.value} className="flex items-center gap-2">
                                                <RadioGroupItem value={o.value} id={`sort-${o.value}`} className="border-IPCprimary text-IPCprimary" />
                                                <Label htmlFor={`sort-${o.value}`} className="text-xs cursor-pointer">{o.label}</Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                </div>
                            </div>
                        </div>

                        {/* Historical Period Presets */}
                        <div className="space-y-3">
                            <p className="text-xs font-semibold uppercase tracking-widest text-IPCprimary border-b border-border pb-1.5">
                                Historical Period
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {HISTORICAL_PERIODS.map((period) => {
                                    const isSelected = (localFilters.historicalPeriod || "") === period.value;
                                    return (
                                        <button
                                            key={period.value}
                                            type="button"
                                            onClick={() => handlePeriodChange(period.value)}
                                            className={`px-3 py-2 border text-xs font-medium uppercase tracking-wider transition-all cursor-pointer ${
                                                isSelected
                                                    ? 'border-IPCprimary bg-IPCprimary text-white font-semibold'
                                                    : 'border-border text-foreground hover:border-IPCprimary/50'
                                            }`}
                                        >
                                            {period.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Condition Filters */}
                        <div className="space-y-3">
                            <p className="text-xs font-semibold uppercase tracking-widest text-IPCprimary border-b border-border pb-1.5">
                                Philatelic Condition
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {availableConditions.map((cond) => {
                                    const isChecked = (localFilters.condition || []).includes(cond);
                                    return (
                                        <label
                                            key={cond}
                                            className={`flex items-center gap-2 px-3 py-2 border cursor-pointer text-xs font-medium transition-all ${
                                                isChecked
                                                    ? 'border-IPCprimary bg-IPCprimary text-white font-semibold'
                                                    : 'border-border text-foreground hover:border-IPCprimary/50'
                                            }`}
                                        >
                                            <Checkbox
                                                checked={isChecked}
                                                onCheckedChange={(c) => handleConditionToggle(cond, c)}
                                                className="hidden"
                                            />
                                            {cond}
                                        </label>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Price Range & Issue Year Range Sliders */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {/* Price Slider */}
                            <div className="space-y-3 border border-border p-4 bg-muted/10">
                                <div className="flex justify-between items-center border-b border-border pb-1.5">
                                    <p className="text-xs font-semibold uppercase tracking-widest text-IPCprimary">
                                        Denomination / Price (₹)
                                    </p>
                                    <span className="font-mono text-xs text-foreground font-bold">
                                        ₹{localFilters.minPrice || 0} – {localFilters.maxPrice ? `₹${localFilters.maxPrice}` : 'Any'}
                                    </span>
                                </div>
                                <div className="space-y-2 pt-1">
                                    <input
                                        type="range"
                                        min="0"
                                        max="5000"
                                        step="50"
                                        value={localFilters.maxPrice || 5000}
                                        onChange={(e) => setLocalFilters(p => ({ ...p, maxPrice: e.target.value === "5000" ? "" : e.target.value }))}
                                        className="w-full accent-IPCprimary cursor-pointer"
                                    />
                                    <div className="grid grid-cols-2 gap-2 pt-1">
                                        <input
                                            type="number"
                                            placeholder="Min ₹0"
                                            value={localFilters.minPrice || ""}
                                            onChange={(e) => setLocalFilters(p => ({ ...p, minPrice: e.target.value }))}
                                            className="w-full text-xs p-1.5 bg-background border border-border focus:border-IPCprimary outline-none"
                                        />
                                        <input
                                            type="number"
                                            placeholder="Max ₹"
                                            value={localFilters.maxPrice || ""}
                                            onChange={(e) => setLocalFilters(p => ({ ...p, maxPrice: e.target.value }))}
                                            className="w-full text-xs p-1.5 bg-background border border-border focus:border-IPCprimary outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Year Slider */}
                            <div className="space-y-3 border border-border p-4 bg-muted/10">
                                <div className="flex justify-between items-center border-b border-border pb-1.5">
                                    <p className="text-xs font-semibold uppercase tracking-widest text-IPCprimary">
                                        Issue Year Slider
                                    </p>
                                    <span className="font-mono text-xs text-foreground font-bold">
                                        {localFilters.minYear || 1854} – {localFilters.maxYear || 2026}
                                    </span>
                                </div>
                                <div className="space-y-2 pt-1">
                                    <input
                                        type="range"
                                        min="1854"
                                        max="2026"
                                        step="1"
                                        value={localFilters.minYear || 1854}
                                        onChange={(e) => setLocalFilters(p => ({ ...p, minYear: e.target.value === "1854" ? "" : e.target.value }))}
                                        className="w-full accent-IPCprimary cursor-pointer"
                                    />
                                    <div className="grid grid-cols-2 gap-2 pt-1">
                                        <input
                                            type="number"
                                            placeholder="From 1854"
                                            value={localFilters.minYear || ""}
                                            onChange={(e) => setLocalFilters(p => ({ ...p, minYear: e.target.value }))}
                                            className="w-full text-xs p-1.5 bg-background border border-border focus:border-IPCprimary outline-none"
                                        />
                                        <input
                                            type="number"
                                            placeholder="To 2026"
                                            value={localFilters.maxYear || ""}
                                            onChange={(e) => setLocalFilters(p => ({ ...p, maxYear: e.target.value }))}
                                            className="w-full text-xs p-1.5 bg-background border border-border focus:border-IPCprimary outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Categories */}
                        <div className="space-y-3">
                            <p className="text-xs font-semibold uppercase tracking-widest text-IPCprimary border-b border-border pb-1.5">
                                Themes & Categories
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                                {availableCategories.map((cat) => {
                                    const isChecked = (localFilters.categories || []).includes(cat);
                                    return (
                                        <label
                                            key={cat}
                                            className={`flex items-center gap-2.5 px-3 py-2 border cursor-pointer transition-all text-xs ${
                                                isChecked
                                                    ? 'border-IPCprimary bg-IPCprimary/10 text-IPCprimary font-semibold'
                                                    : 'border-border text-muted-foreground hover:border-IPCprimary/50'
                                            }`}
                                        >
                                            <Checkbox
                                                id={`cat-${cat}`}
                                                checked={isChecked}
                                                onCheckedChange={(checked) => handleCategoryToggle(cat, checked)}
                                                className="border-IPCprimary data-[state=checked]:bg-IPCprimary"
                                            />
                                            <span className="truncate">{cat}</span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>

                    </div>

                    <DrawerFooter className="border-t border-border pt-4">
                        <div className="flex gap-3">
                            <button
                                onClick={handleApplyFilters}
                                className="flex-1 py-2.5 bg-IPCprimary text-white text-xs font-semibold uppercase tracking-widest hover:opacity-90 transition-opacity cursor-pointer"
                            >
                                Apply Filters
                            </button>
                            <button
                                onClick={handleClearAll}
                                className="flex-1 py-2.5 border border-border text-foreground text-xs font-semibold uppercase tracking-widest hover:border-IPCsecondary hover:text-IPCsecondary transition-all flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <X className="h-3.5 w-3.5" /> Clear All
                            </button>
                        </div>
                        <DrawerClose asChild>
                            <button className="py-2 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                                Cancel
                            </button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    );
}