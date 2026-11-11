
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import { AiOutlineScan } from "react-icons/ai";

import { apiClient } from "@/lib/api-client";

interface ProductSuggestion {
  id: number;
  name: string;
}

interface SearchBarProps {
  onScanClick?: () => void;
}

export default function SearchBar({ onScanClick }: SearchBarProps) {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<ProductSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // جلب الاقتراحات من قاعدة البيانات
  useEffect(() => {
    const search = query.trim();

    if (search.length < 2) {
      setSuggestions([]);
      return;
    }

    let cancelled = false;

    const timeout = setTimeout(async () => {
      try {
        const response = await apiClient.get<ProductSuggestion[]>(
          "/products/suggestions",
          {
            params: { search },
          }
        );

        if (!cancelled) {
          setSuggestions(response.data.slice(0, 3));
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to load product suggestions:", error);
          setSuggestions([]);
        }
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [query]);

  // الانتقال إلى صفحة المنتجات
  const handleSearch = (value: string) => {
    const search = value.trim();

    if (!search) return;

    setShowSuggestions(false);

    router.push(`/products?search=${encodeURIComponent(search)}`);
  };

  // اختيار اقتراح
  const handleSelectSuggestion = (product: ProductSuggestion) => {
    setQuery(product.name);
    setShowSuggestions(false);

    router.push(
      `/products?search=${encodeURIComponent(product.name)}`
    );
  };

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
                setQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setShowSuggestions(false);
                }

                if (e.key === "Enter") {
                  e.preventDefault();

                  if (visibleSuggestions.length > 0) {
                    handleSelectSuggestion(visibleSuggestions[0]);
                  } else {
                    handleSearch(query);
                  }
                }
              }}
              placeholder="بحث باسم المنتج أو العلامة التجارية"
              autoComplete="off"
              className="w-full min-w-0 border-none bg-transparent p-0 text-right text-xs font-semibold text-gray-800 outline-none placeholder:font-medium placeholder:text-gray-500 focus:ring-0 sm:text-sm"
            />

            {/* مسح البحث */}
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setSuggestions([]);
                  setShowSuggestions(false);
                }}
                aria-label="مسح البحث"
                className="mr-2 text-gray-400 transition hover:text-[#df6951]"
              >
                ✕
              </button>
            )}

            {/* البحث */}
            <button
              type="button"
              onClick={() => handleSearch(query)}
              aria-label="بحث"
              className="mr-1 flex shrink-0 items-center justify-center p-1 text-[#004b79] transition-transform hover:scale-105 active:scale-95"
            >
              <HiOutlineMagnifyingGlass className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>

            {/* مسح الباركود */}
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
          {showSuggestions && query.trim().length >= 2 && (
            <>
              <button
                type="button"
                aria-label="إغلاق الاقتراحات"
                className="fixed inset-0 z-30 cursor-default"
                onClick={() => setShowSuggestions(false)}
              />

              {visibleSuggestions.length > 0 && (
                <div className="absolute right-0 top-full z-40 mt-2 w-full overflow-hidden rounded-2xl border border-[#e8d8c8] bg-white py-2 text-right shadow-xl">

                  <p className="px-4 pb-2 text-[11px] font-bold text-gray-400">
                    المنتجات المقترحة
                  </p>

                  {visibleSuggestions.map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => handleSelectSuggestion(product)}
                      className="flex w-full items-center gap-3 px-4 py-3 text-right text-sm font-semibold text-gray-700 transition hover:bg-[#f7efe6] hover:text-[#004b79]"
                    >
                      <HiOutlineMagnifyingGlass className="h-4 w-4 shrink-0 text-gray-400" />

                      <span className="truncate">{product.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
