"use client";


import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, usePathname } from '@/src/i18n/navigation';
import { useSearchParams } from 'next/navigation';
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import { FILTERS, SORT_OPTIONS } from "@/lib/const";

const FilterPopover = ({ 
    label, 
    children, 
    active,
    isOpen,
    setIsOpen 
}: { 
    label: string, 
    children: React.ReactNode,
    active?: boolean,
    isOpen?: boolean,
    setIsOpen?: (value: boolean) => void
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = isOpen !== undefined ? isOpen : internalOpen;
  const onOpenChange = setIsOpen !== undefined ? setIsOpen : setInternalOpen;

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm font-semibold transition-all whitespace-nowrap cursor-pointer",
            active 
                ? "bg-primary border-primary text-white shadow-md shadow-primary/20" 
                : "bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
          )}
        >
          {label}
          <ChevronDown className={cn("w-4 h-4 transition-transform", active ? "text-white rotate-180" : "text-gray-400")} />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 rounded-2xl shadow-xl border-gray-100 animate-in fade-in zoom-in duration-200" align="start">
        {children}
      </PopoverContent>
    </Popover>
  );
};

// Separate component for filter content to prevent re-renders
const MoreFiltersContent = ({ 
  searchParams, 
  router, 
  setIsMoreOpen,
  localMinPrice,
  setLocalMinPrice,
  localMaxPrice,
  setLocalMaxPrice,
  setMinPrice,
  setMaxPrice,
  localSort,
  setLocalSort,
  localBrands,
  setLocalBrands,
  localConditions,
  setLocalConditions,
  clearAll,
  handleApplyFilters
}: any) => {
  
  const toggleBrand = (brand: string) => {
    setLocalBrands((prev: string[]) => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  const toggleCondition = (condition: string) => {
    setLocalConditions((prev: string[]) => 
      prev.includes(condition) 
        ? prev.filter(c => c !== condition)
        : [...prev, condition]
    );
  };

  return (
    <div className="flex flex-col h-full">
    
    <div className="flex flex-row items-center justify-between py-4 px-6 border-b border-gray-100 shrink-0">
         <SheetTitle className="text-xl font-black tracking-tight text-slate-900">Filters and Sort</SheetTitle>
         <SheetClose>
          <p className="text-slate-600 cursor-pointer select-none font-bold">Close</p>
        </SheetClose>
    </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Sort Section */}
        <section className="space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-primary">Sort</h3>
          <div className="space-y-3">
            {SORT_OPTIONS.map((opt) => (
              <label key={opt.value} className="flex items-center justify-between cursor-pointer group">
                <span className={cn(
                    "text-base font-bold transition-colors",
                    localSort === opt.value ? "text-slate-900" : "text-slate-400 group-hover:text-slate-600"
                )}>{opt.label}</span>
                <div className={cn(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                    localSort === opt.value ? "border-primary" : "border-gray-300"
                )}>
                    {localSort === opt.value && <div className="w-3 h-3 rounded-full bg-primary" />}
                </div>
                <input 
                    type="radio" 
                    name="sort-mobile" 
                    className="hidden" 
                    checked={localSort === opt.value}
                    onChange={() => setLocalSort(opt.value)}
                />
              </label>
            ))}
          </div>
        </section>

        {/* Brand Section */}
        <section className="space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-primary">Brand</h3>
          <div className="grid grid-cols-2 gap-3">
            {FILTERS.brand.map((brand) => (
              <label 
                key={brand} 
                className={cn(
                    "flex items-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer",
                    localBrands.includes(brand) 
                        ? "bg-primary/10 border-primary text-slate-900" 
                        : "bg-gray-50 border-gray-200 text-slate-600 hover:bg-gray-100"
                )}
              >
                <Checkbox 
                    checked={localBrands.includes(brand)}
                    onClick={() => toggleBrand(brand)}
                    className="border-gray-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <span className="text-sm font-bold">{brand}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Condition Section */}
        <section className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-primary">Condition</h3>
            <div className="grid grid-cols-2 gap-3">
                {FILTERS.condition.map((cond) => (
                    <label 
                        key={cond} 
                        className={cn(
                            "flex items-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer",
                            localConditions.includes(cond) 
                                ? "bg-primary/10 border-primary text-slate-900" 
                                : "bg-gray-50 border-gray-200 text-slate-600 hover:bg-gray-100"
                        )}
                    >
                        <Checkbox 
                            checked={localConditions.includes(cond)}
                            onClick={() => toggleCondition(cond)}
                            className="border-gray-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <span className="text-sm font-bold">{cond}</span>
                    </label>
                ))}
            </div>
        </section>
      </div>

      {/* Price + Actions Footer - Always Visible */}
      <div className="border-t border-gray-100 bg-white shrink-0">
        {/* Price Section */}
        <div className="p-6 pb-4 space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-primary">Price Range</h3>
          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
                <div className="mb-1">
                  <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Min (RM)</span>
                </div>
                <input 
                    id="minPrice"
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder="0" 
                    value={localMinPrice}
                    onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        setLocalMinPrice(value);
                    }}
                    onBlur={() => setMinPrice(localMinPrice)}
                    className="flex h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2 text-base font-bold text-slate-900 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
            </div>
            <div className="flex-1 space-y-2">
                <div className="mb-1">
                  <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Max (RM)</span>
                </div>
                <input 
                    id="maxPrice"
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder="Any" 
                    value={localMaxPrice}
                    onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        setLocalMaxPrice(value);
                    }}
                    onBlur={() => setMaxPrice(localMaxPrice)}
                    className="flex h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2 text-base font-bold text-slate-900 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-6 pb-6 grid grid-cols-2 gap-4">
          <Button 
              className="rounded-2xl bg-gray-100 text-slate-700 hover:bg-gray-200 h-12 cursor-pointer select-none font-black uppercase tracking-widest"
              onClick={clearAll}
          >
              Clear
          </Button>
          <Button 
              className="rounded-2xl cursor-pointer select-none h-12 font-black uppercase tracking-widest bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
              onClick={() => {
                  handleApplyFilters();
                  setIsMoreOpen(false);
              }}
          >
              Apply
          </Button>
        </div>
      </div>
    </div>
  );
};

export const FilterBar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isCategoryMobileOpen, setIsCategoryMobileOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isPriceOpen, setIsPriceOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Price states for inputs - use local state to prevent re-renders
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  
  // Local input states to prevent re-renders while typing
  const [localMinPrice, setLocalMinPrice] = useState(minPrice);
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice);

  // Local filter states - only apply when clicking Apply button
  const [localSort, setLocalSort] = useState(searchParams.get("sort") || "relevance");
  const [localBrands, setLocalBrands] = useState<string[]>(searchParams.get("brand")?.split(',').filter(Boolean) || []);
  const [localConditions, setLocalConditions] = useState<string[]>(searchParams.get("condition")?.split(',').filter(Boolean) || []);

  if (!mounted) return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {[1,2,3,4].map(i => (
            <div key={i} className="h-10 w-24 bg-gray-100 animate-pulse rounded-full shrink-0" />
        ))}
    </div>
  );

  const handleToggle = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    if(value === "All Categories") {
      router.push(`/search`);
    } else {
      router.push(`/search?${params.toString()}`);
    }
  };

  const handleApplyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Apply sort
    if (localSort && localSort !== 'relevance') {
      params.set("sort", localSort);
    } else {
      params.delete("sort");
    }
    
    // Apply brands
    if (localBrands.length > 0) {
      params.set("brand", localBrands.join(','));
    } else {
      params.delete("brand");
    }
    
    // Apply conditions
    if (localConditions.length > 0) {
      params.set("condition", localConditions.join(','));
    } else {
      params.delete("condition");
    }
    
    // Apply prices
    if (minPrice) params.set("minPrice", minPrice);
    else params.delete("minPrice");
    if (maxPrice) params.set("maxPrice", maxPrice);
    else params.delete("maxPrice");
    
    setIsPriceOpen(false);
    router.push(`/search?${params.toString()}`);
  };

  const clearAll = () => {
    setMinPrice("");
    setMaxPrice("");
    setLocalMinPrice("");
    setLocalMaxPrice("");
    setLocalSort("relevance");
    setLocalBrands([]);
    setLocalConditions([]);
    setIsMoreOpen(false);
    router.push("/search");
  };

  const currentCategoryLabel = searchParams.get("category") || "Category";
  const currentSortLabel = SORT_OPTIONS.find(s => s.value === (searchParams.get("sort") || 'relevance'))?.label || "Sort";
  const hasFilters = Array.from(searchParams.keys()).filter(k => k !== 'q').length > 0;

  return (
    <div className="flex flex-col gap-4">
      {/* Desktop Filter Bar (Visible on mid+) */}
      <div className="hidden sm:flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-6 px-6 sm:mx-0 sm:px-0">
        <FilterPopover
          label={currentCategoryLabel}
          active={!!searchParams.get("category")}
          isOpen={isCategoryOpen}
          setIsOpen={setIsCategoryOpen}
        >
          <div className="p-2 space-y-1 w-48">
            {FILTERS.category.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  handleToggle("category", cat);
                  setIsCategoryOpen(false);
                }}
                className={cn(
                  "w-full text-left px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer",
                  searchParams.get("category")?.split(',').includes(cat)
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-gray-50 text-gray-600"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </FilterPopover>

        <FilterPopover 
          label={currentSortLabel} 
          active={!!searchParams.get("sort")}
          isOpen={isSortOpen}
          setIsOpen={setIsSortOpen}
        >
           <div className="p-2 space-y-1 w-56">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  const params = new URLSearchParams(searchParams.toString());
                  params.set("sort", opt.value);
                  router.push(`/search?${params.toString()}`);
                  setIsSortOpen(false);
                }}
                className={cn(
                  "w-full text-left px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer",
                  (searchParams.get("sort") || 'relevance') === opt.value
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-gray-50 text-gray-600"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </FilterPopover>

        <div className="h-6 w-px bg-gray-200 mx-2" />

        <FilterPopover label="Brand" active={!!searchParams.get("brand")}>
           <div className="p-4 space-y-3 min-w-[220px]">
            {FILTERS.brand.map((brand) => (
              <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                <Checkbox 
                    checked={searchParams.get("brand")?.split(',').includes(brand)}
                    onChange={() => handleToggle("brand", brand)}
                    className="rounded-md border-gray-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <span className="text-sm font-bold text-gray-600 group-hover:text-primary transition-colors">{brand}</span>
              </label>
            ))}
          </div>
        </FilterPopover>

        <FilterPopover label="Condition" active={!!searchParams.get("condition")}>
           <div className="p-4 space-y-3 min-w-[200px]">
            {FILTERS.condition.map((cond) => (
              <label key={cond} className="flex items-center gap-3 cursor-pointer group">
                <Checkbox 
                    checked={searchParams.get("condition")?.split(',').includes(cond)}
                    onChange={() => handleToggle("condition", cond)}
                    className="rounded-md border-gray-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <span className="text-sm font-bold text-gray-600 group-hover:text-primary transition-colors">{cond}</span>
              </label>
            ))}
          </div>
        </FilterPopover>

        <FilterPopover label="Price" active={!!searchParams.get("minPrice") || !!searchParams.get("maxPrice")} isOpen={isPriceOpen} setIsOpen={setIsPriceOpen}>
           <div className="p-6 space-y-6 min-w-[300px]">
             <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Min</label>
                        <Input
                            id="minPrice"
                            type="number" 
                            placeholder="0"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            className="bg-gray-50 border-gray-100 rounded-xl"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Max</label>
                        <Input 
                            type="number" 
                            placeholder="Any"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            className="bg-gray-50 border-gray-100 rounded-xl"
                        />
                    </div>
                </div>
             </div>
             <Button className="w-full rounded-xl cursor-pointer font-bold bg-primary hover:bg-primary/90 text-white" onClick={handleApplyFilters}>Apply Price</Button>
          </div>
        </FilterPopover>

        {hasFilters && (
          <button 
            onClick={clearAll}
            className="text-sm font-black text-primary hover:text-primary/80 ml-4 whitespace-nowrap uppercase tracking-widest transition-colors cursor-pointer"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Mobile Condensed Bar (Visible on mobile only) */}
      <div className="flex sm:hidden items-center gap-2">
          <FilterPopover
            label={currentCategoryLabel}
            active={!!searchParams.get("category")}
            isOpen={isCategoryMobileOpen}
            setIsOpen={setIsCategoryMobileOpen}
          >
            <div className="p-2 space-y-1 w-48">
              {FILTERS.category.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    handleToggle("category", cat);
                    setIsCategoryMobileOpen(false);
                  }}
                  className={cn(
                    "w-full text-left px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center justify-between",
                    searchParams.get("category")?.split(',').includes(cat)
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-gray-50 text-gray-600"
                  )}
                >
                  {cat}
                  {searchParams.get("category")?.split(',').includes(cat) && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                </button>
              ))}
            </div>
          </FilterPopover>

          <div className="h-6 w-px bg-gray-200 mx-1" />

        <Sheet open={isMoreOpen} onOpenChange={setIsMoreOpen}>
            <SheetTrigger asChild>
                <button className={cn(
                    "flex items-center gap-2 px-6 py-2 rounded-full border text-[11px] md:text-sm font-black uppercase tracking-widest transition-all cursor-pointer",
                    hasFilters ? "bg-primary border-primary text-white" : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                )}>
                    More filters
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[100vh] p-0">
                <MoreFiltersContent 
                  searchParams={searchParams}
                  router={router}
                  setIsMoreOpen={setIsMoreOpen}
                  localMinPrice={localMinPrice}
                  setLocalMinPrice={setLocalMinPrice}
                  localMaxPrice={localMaxPrice}
                  setLocalMaxPrice={setLocalMaxPrice}
                  setMinPrice={setMinPrice}
                  setMaxPrice={setMaxPrice}
                  localSort={localSort}
                  setLocalSort={setLocalSort}
                  localBrands={localBrands}
                  setLocalBrands={setLocalBrands}
                  localConditions={localConditions}
                  setLocalConditions={setLocalConditions}
                  clearAll={clearAll}
                  handleApplyFilters={handleApplyFilters}
                />
            </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};
