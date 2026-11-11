
"use client";

import React, { useState } from "react";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import { AiOutlineScan } from "react-icons/ai";
import { FiChevronDown } from "react-icons/fi";

import type { Category } from "@/types/category";

interface ProductSuggestion {
  id: number;
  name: string;
}

interface SearchBarProps {
  categories: Category[];
  suggestions: ProductSuggestion[];
  onSearch?: (query: string, categoryId?: number) => void;
  onScanClick?: () => void;
}

export default function SearchBar({
  categories,
  suggestions,
  onSearch,
  onScanClick,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isOpen, setIsOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSearch = (value: string, categoryId: string) => {
    const parsedCategoryId =
      categoryId === "all" ? undefined : Number(categoryId);

    onSearch?.(value, parsedCategoryId);
  };

  const handleSelectCategory = (id: string) => {
    setSelectedCategory(id);
    setIsOpen(false);
    handleSearch(query, id);
  };

  const handleSelectSuggestion = (name: string) => {
    setQuery(name);
    setShowSuggestions(false);
    handleSearch(name, selectedCategory);
  };

  const currentCategoryName =
    selectedCategory === "all"
      ? "كل التصنيفات"
      : categories.find((cat) => String(cat.id) === selectedCategory)?.name ||
        "كل التصنيفات";

  const visibleSuggestions = suggestions.slice(0, 3);

  return (
    <div className="mx-auto w-full max-w-7xl px-3 sm:px-6 lg:px-8">
      <div className="flex items-center gap-2 sm:gap-3">

        {/* حقل البحث والاقتراحات */}
        <div className="relative min-w-0 flex-1">
          <div className="relative flex h-11 items-center rounded-full border border-[#e8d8c8] bg-[#f7efe6] px-3 shadow-[0_2px_8px_rgba(0,0,0,0.03)] transition-all hover:bg-[#f3e8dc] focus-within:border-[#004b79]/40 focus-within:bg-[#f3e8dc] sm:h-12 sm:px-4">

            <HiOutlineMagnifyingGlass className="ml-2 h-5 w-5 shrink-0 text-[#004b79] sm:h-6 sm:w-6" />

            <input
              type="text"
              value={query}
              onFocus={() => setShowSuggestions(true)}
              onChange={(e) => {
                const value = e.target.value;
                setQuery(value);
                setShowSuggestions(true);
                handleSearch(value, selectedCategory);
              }}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setShowSuggestions(false);
                }

                if (e.key === "Enter" && visibleSuggestions.length > 0) {
                  handleSelectSuggestion(visibleSuggestions[0].name);
                }
              }}
              placeholder="بحث باسم المنتج أو العلامة التجارية"
              autoComplete="off"
              className="w-full min-w-0 border-none bg-transparent p-0 text-right text-xs font-semibold text-gray-800 outline-none placeholder:font-medium placeholder:text-gray-500 focus:ring-0 sm:text-sm"
            />

            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setShowSuggestions(false);
                  handleSearch("", selectedCategory);
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

          {/* اقتراحات المنتجات */}
          {showSuggestions && query.trim().length > 0 && visibleSuggestions.length > 0 && (
            <>
              <button
                type="button"
                aria-label="إغلاق الاقتراحات"
                className="fixed inset-0 z-30 cursor-default"
                onClick={() => setShowSuggestions(false)}
              />

              <div className="absolute right-0 top-full z-40 mt-2 w-full overflow-hidden rounded-2xl border border-[#e8d8c8] bg-white py-2 text-right shadow-xl">
                <p className="px-4 pb-2 text-[11px] font-bold text-gray-400">
                  المنتجات المقترحة
                </p>

                {visibleSuggestions.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => handleSelectSuggestion(product.name)}
                    className="flex w-full items-center gap-3 px-4 py-3 text-right text-sm font-semibold text-gray-700 transition hover:bg-[#f7efe6] hover:text-[#004b79]"
                  >
                    <HiOutlineMagnifyingGlass className="h-4 w-4 shrink-0 text-gray-400" />
                    <span className="truncate">{product.name}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* اختيار التصنيف */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => {
              setIsOpen(!isOpen);
              setShowSuggestions(false);
            }}
            aria-expanded={isOpen}
            className="flex h-11 w-28 items-center justify-between gap-1.5 rounded-full border border-[#e8d8c8] bg-white px-3 text-xs font-bold text-[#004b79] shadow-xs transition-colors hover:border-[#004b79]/40 sm:h-12 sm:w-36 sm:px-4 sm:text-sm md:w-44"
          >
            <span className="truncate">{currentCategoryName}</span>

            <FiChevronDown
              className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isOpen && (
            <>
              <button
                type="button"
                aria-label="إغلاق قائمة التصنيفات"
                className="fixed inset-0 z-40 cursor-default"
                onClick={() => setIsOpen(false)}
              />

              <div className="absolute left-0 z-50 mt-2 max-h-72 w-44 overflow-y-auto rounded-2xl border border-gray-100 bg-white py-1.5 text-right shadow-xl sm:right-0 sm:left-auto sm:w-52">
                <button
                  type="button"
                  onClick={() => handleSelectCategory("all")}
                  className={`flex w-full items-center justify-between px-4 py-2.5 text-right text-xs font-semibold transition-colors ${
                    selectedCategory === "all"
                      ? "bg-[#004b79] font-bold text-white"
                      : "text-gray-700 hover:bg-[#f7efe6] hover:text-[#004b79]"
                  }`}
                >
                  <span>كل التصنيفات</span>
                  {selectedCategory === "all" && (
                    <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-[10px]">
                      محدد
                    </span>
                  )}
                </button>

                {categories.map((cat) => {
                  const id = String(cat.id);
                  const isActive = selectedCategory === id;

                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleSelectCategory(id)}
                      className={`flex w-full items-center justify-between px-4 py-2.5 text-right text-xs font-semibold transition-colors ${
                        isActive
                          ? "bg-[#004b79] font-bold text-white"
                          : "text-gray-700 hover:bg-[#f7efe6] hover:text-[#004b79]"
                      }`}
                    >
                      <span>{cat.name}</span>
                      {isActive && (
                        <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-[10px]">
                          محدد
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
