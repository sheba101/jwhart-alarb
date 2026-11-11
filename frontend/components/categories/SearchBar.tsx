
"use client";

import React, { useState } from "react";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import { AiOutlineScan } from "react-icons/ai";

interface SearchBarProps {
  onSearch?: (query: string) => void;
  onScanClick?: () => void;
}

export default function SearchBar({
  onSearch,
  onScanClick,
}: SearchBarProps) {
  const [query, setQuery] = useState("");

  return (
    <div className="mx-auto w-full max-w-7xl px-3 sm:px-6 lg:px-8">
      <div className="flex items-center gap-2">
        <div className="relative flex h-11 min-w-0 flex-1 items-center rounded-full border border-[#e8d8c8] bg-[#f7efe6] px-3 shadow-[0_2px_8px_rgba(0,0,0,0.03)] transition-all hover:bg-[#f3e8dc] focus-within:border-[#004b79]/40 focus-within:bg-[#f3e8dc] sm:h-12 sm:px-4">

          <HiOutlineMagnifyingGlass className="ml-2 h-5 w-5 shrink-0 text-[#004b79] sm:h-6 sm:w-6" />

          <input
            type="text"
            value={query}
            onChange={(e) => {
              const value = e.target.value;
              setQuery(value);
              onSearch?.(value);
            }}
            placeholder="ابحث عن صنف..."
            className="w-full min-w-0 border-none bg-transparent p-0 text-right text-xs font-semibold text-gray-800 outline-none placeholder:font-medium placeholder:text-gray-500 focus:ring-0 sm:text-sm"
          />

          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                onSearch?.("");
              }}
              aria-label="مسح البحث"
              className="mr-2 text-gray-400 transition hover:text-[#df6951]"
            >
              ✕
            </button>
          )}

          <button
            type="button"
            onClick={onScanClick}
            aria-label="مسح الباركود"
            className="mr-1 flex shrink-0 items-center justify-center p-1 text-[#004b79] transition-transform hover:scale-105 hover:text-[#002d4b] active:scale-95"
          >
            <AiOutlineScan className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
