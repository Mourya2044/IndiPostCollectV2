import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
import { Filter, X } from "lucide-react";

const CATEGORIES = [
    { value: "CA", label: "Category A" },
    { value: "CB", label: "Category B" },
    { value: "CC", label: "Category C" },
    { value: "CD", label: "Category D" },
    { value: "CE", label: "Category E" }
];

const SORT_OPTIONS = [
    { value: "title", label: "Title" },
    { value: "price", label: "Price" },
    { value: "date", label: "Date" },
    { value: "category", label: "Category" }
];

export default function FilterDrawer({ filters, onFilterChange, onClearFilters }) {
    const [localFilters, setLocalFilters] = useState(filters);
    const [isOpen, setIsOpen] = useState(false);

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
            forSale: undefined,
            isMuseumPiece: undefined,
            page: 1,
            limit: 12
        };
        setLocalFilters(clearedFilters);
        onClearFilters();
        setIsOpen(false);
    };

    const handleCategoryChange = (categoryValue, checked) => {
        setLocalFilters(prev => ({
            ...prev,
            categories: checked 
                ? [...prev.categories, categoryValue]
                : prev.categories.filter(cat => cat !== categoryValue)
        }));
    };

    const handleSortChange = (value) => {
        setLocalFilters(prev => ({
            ...prev,
            sortBy: value
        }));
    };

    const handleSortOrderChange = (value) => {
        setLocalFilters(prev => ({
            ...prev,
            sort: value
        }));
    };

    // const handleForSaleChange = (value) => {
    //     setLocalFilters(prev => ({
    //         ...prev,
    //         forSale: value === "all" ? undefined : value === "true"
    //     }));
    // };

    // const handleMuseumPieceChange = (value) => {
    //     setLocalFilters(prev => ({
    //         ...prev,
    //         isMuseumPiece: value === "all" ? undefined : value === "true"
    //     }));
    // };

    // Count active filters
    const activeFilterCount = [
        filters.search,
        filters.sort,
        filters.categories.length > 0,
        // filters.forSale !== undefined,
        // filters.isMuseumPiece !== undefined
    ].filter(Boolean).length;

    return (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
            <DrawerTrigger asChild>
                <Button variant="outline" className="relative">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                    {activeFilterCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {activeFilterCount}
                        </span>
                    )}
                </Button>
            </DrawerTrigger>
            
            <DrawerContent className="max-h-[90vh]">
                <div className="mx-auto w-full max-w-2xl">
                    <DrawerHeader>
                        <DrawerTitle>Filter Stamps</DrawerTitle>
                        <DrawerDescription>
                            Refine your search with the options below
                        </DrawerDescription>
                    </DrawerHeader>
                    
                    <div className="p-4 space-y-6 overflow-y-auto max-h-[60vh]">
                        {/* Sort Options */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Sort Options</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Sort By</Label>
                                    <Select value={localFilters.sortBy} onValueChange={handleSortChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select field to sort by" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {SORT_OPTIONS.map(option => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                
                                <div className="space-y-2">
                                    <Label>Sort Order</Label>
                                    <RadioGroup value={localFilters.sort} onValueChange={handleSortOrderChange}>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="asc" id="asc" />
                                            <Label htmlFor="asc">Ascending</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="desc" id="desc" />
                                            <Label htmlFor="desc">Descending</Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                            </div>
                        </div>

                        {/* Categories */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Categories</h3>
                            <div className="grid grid-cols-2 gap-2">
                                {CATEGORIES.map((category) => (
                                    <div key={category.value} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={category.value}
                                            checked={localFilters.categories.includes(category.value)}
                                            onCheckedChange={(checked) => 
                                                handleCategoryChange(category.value, checked)
                                            }
                                        />
                                        <Label htmlFor={category.value} className="text-sm">
                                            {category.label}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* For Sale Filter */}
                        {/* <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Availability</h3>
                            <div className="space-y-2">
                                <Label>For Sale</Label>
                                <RadioGroup 
                                    value={
                                        localFilters.forSale === undefined 
                                            ? "all" 
                                            : localFilters.forSale.toString()
                                    } 
                                    onValueChange={handleForSaleChange}
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="all" id="all-sale" />
                                        <Label htmlFor="all-sale">All</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="true" id="for-sale" />
                                        <Label htmlFor="for-sale">For Sale</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="false" id="not-for-sale" />
                                        <Label htmlFor="not-for-sale">Not For Sale</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        </div> */}

                        {/* Museum Piece Filter */}
                        {/* <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Collection Type</h3>
                            <div className="space-y-2">
                                <Label>Museum Piece</Label>
                                <RadioGroup 
                                    value={
                                        localFilters.isMuseumPiece === undefined 
                                            ? "all" 
                                            : localFilters.isMuseumPiece.toString()
                                    } 
                                    onValueChange={handleMuseumPieceChange}
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="all" id="all-museum" />
                                        <Label htmlFor="all-museum">All</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="true" id="museum-piece" />
                                        <Label htmlFor="museum-piece">Museum Pieces</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="false" id="regular-piece" />
                                        <Label htmlFor="regular-piece">Regular Collection</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        </div> */}
                    </div>
                    
                    <DrawerFooter>
                        <div className="flex gap-2">
                            <Button onClick={handleApplyFilters} className="flex-1">
                                Apply Filters
                            </Button>
                            <Button 
                                variant="outline" 
                                onClick={handleClearAll}
                                className="flex-1"
                            >
                                <X className="h-4 w-4 mr-2" />
                                Clear All
                            </Button>
                        </div>
                        <DrawerClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    );
}