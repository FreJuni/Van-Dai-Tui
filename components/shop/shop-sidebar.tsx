"use client";

import React from "react";
import { useRouter, usePathname } from '@/src/i18n/navigation';
import { useSearchParams } from 'next/navigation';
import { Checkbox } from "../ui/checkbox";
import { cn } from "@/lib/utils";

/* ----------------------------------
   Filter Configuration
---------------------------------- */

const FILTERS = {
  category: ["Phones", "Laptops", "Tablets"],
  brand: ["Apple", "Samsung", "Dell", "HP", "Lenovo", "Asus"],
  condition: ["New", "Used", "Refurbished"],
  availability: ["In stock"],

  phone: {
    storage: ["64GB", "128GB", "256GB", "512GB"],
    network: ["4G", "5G"],
    ram: ["4GB", "6GB", "8GB", "12GB"],
  },

  laptop: {
    ram: ["8GB", "16GB", "32GB"],
    cpu: ["Intel i5", "Intel i7", "Ryzen 5", "Ryzen 7", "M1", "M2"],
    screen: ['13"', '14"', '15.6"', '16"'],
  },
};

/* ----------------------------------
   Reusable Filter Group
---------------------------------- */

const FilterGroup = ({
  title,
  filterKey,
  options,
  isChecked,
  toggle,
}: {
  title: string;
  filterKey: string;
  options: string[];
  isChecked: (key: string, value: string) => boolean;
  toggle: (key: string, value: string) => void;
}) => {
  return (
    <div className="space-y-3">
      <h4 className="text-xs font-bold uppercase tracking-wide text-gray-400">
        {title}
      </h4>

      {options.map(option => (
        <label
          key={option}
          className="flex items-center gap-3 cursor-pointer text-sm text-gray-600 hover:text-primary transition"
        >
          <Checkbox
            onClick={() => toggle(filterKey, option)}
          />
          {option}
        </label>
      ))}
    </div>
  );
};

/* ----------------------------------
   Sidebar Component
---------------------------------- */

export const ShopSidebar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  /* ---------- Helpers ---------- */

  const isChecked = (key: string, value: string) => {
    const current = searchParams.get(key)?.split(",") || [];
    return current.includes(value);
  };

  const toggleFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const current = params.get(key)?.split(",") || [];

    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];

    if (updated.length > 0) {
      params.set(key, updated.join(","));
    } else {
      params.delete(key);
    }

    router.push(`/search?${params.toString()}`);
  };

  const selectedCategories = searchParams.get("category") || "";

  const isPhone = selectedCategories.includes("Phones");
  const isLaptop = selectedCategories.includes("Laptops");

  /* ---------- Render ---------- */

  return (
    <aside
      className={cn(
        "w-full max-w-xs space-y-8",
        "bg-white rounded-2xl border border-gray-100 p-6"
      )}
    >
      {/* Core Filters */}
      <FilterGroup
        title="Category"
        filterKey="category"
        options={FILTERS.category}
        isChecked={isChecked}
        toggle={toggleFilter}
      />

      <FilterGroup
        title="Brand"
        filterKey="brand"
        options={FILTERS.brand}
        isChecked={isChecked}
        toggle={toggleFilter}
      />

      <FilterGroup
        title="Condition"
        filterKey="condition"
        options={FILTERS.condition}
        isChecked={isChecked}
        toggle={toggleFilter}
      />

      {/* Divider */}
      {(isPhone || isLaptop) && (
        <div className="border-t border-gray-100 pt-6" />
      )}

      {/* Phone Filters */}
      {isPhone && (
        <>
          <FilterGroup
            title="Storage"
            filterKey="storage"
            options={FILTERS.phone.storage}
            isChecked={isChecked}
            toggle={toggleFilter}
          />

          <FilterGroup
            title="RAM"
            filterKey="ram"
            options={FILTERS.phone.ram}
            isChecked={isChecked}
            toggle={toggleFilter}
          />

          <FilterGroup
            title="Network"
            filterKey="network"
            options={FILTERS.phone.network}
            isChecked={isChecked}
            toggle={toggleFilter}
          />
        </>
      )}

      {/* Laptop Filters */}
      {isLaptop && (
        <>
          <FilterGroup
            title="RAM"
            filterKey="ram"
            options={FILTERS.laptop.ram}
            isChecked={isChecked}
            toggle={toggleFilter}
          />

          <FilterGroup
            title="Processor"
            filterKey="cpu"
            options={FILTERS.laptop.cpu}
            isChecked={isChecked}
            toggle={toggleFilter}
          />

          <FilterGroup
            title="Screen Size"
            filterKey="screen"
            options={FILTERS.laptop.screen}
            isChecked={isChecked}
            toggle={toggleFilter}
          />
        </>
      )}
    </aside>
  );
};
