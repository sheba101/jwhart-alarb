
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";

import SearchBar from "@/components/products/SearchBar";
import ProductGrid from "@/components/products/ProductGrid";

import { useProducts } from "@/hooks/products/use-products";
import { useCategories } from "@/hooks/categories/use-categories";

import RightCornerDecoration from "@/components/common/decoration/RightCornerDecoration";
import LeftCornerDecoration from "@/components/common/decoration/LeftCornerDecoration";

import {
  HiChevronRight,
  HiChevronLeft,
  HiChevronDoubleRight,
  HiChevronDoubleLeft,
} from "react-icons/hi2";

interface ProductSuggestion {
  id: number;
  name: string;
}

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState<number | undefined>();
  const [currentPage, setCurrentPage] = useState(1);

  // اقتراحات المنتجات القادمة من قاعدة البيانات
  const [suggestions, setSuggestions] = useState<ProductSuggestion[]>([]);

  const limit = 10;

  // قراءة التصنيف من الرابط عند فتح الصفحة
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const categoryParam = params.get("categoryId");

    const parsedCategoryId = categoryParam
      ? Number(categoryParam)
      : undefined;

    setCategoryId(
      parsedCategoryId &&
        Number.isInteger(parsedCategoryId) &&
        parsedCategoryId > 0
        ? parsedCategoryId
        : undefined
    );

    setCurrentPage(1);
  }, []);

  // جلب اقتراحات المنتجات من قاعدة البيانات
  useEffect(() => {
    const query = search.trim();

    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    let cancelled = false;

    const timeout = setTimeout(async () => {
      try {
        const response = await apiClient.get<ProductSuggestion[]>(
          "/products/suggestions",
          {
            params: {
              search: query,
            },
          }
        );

        if (!cancelled) {
          setSuggestions(response.data);
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
  }, [search]);

  // جلب التصنيفات النشطة
  const {
    data: categoriesData,
    isLoading: isCategoriesLoading,
  } = useCategories({
    page: 1,
    limit: 100,
    isActive: true,
  });

  // جلب المنتجات حسب البحث والتصنيف والصفحة
  const {
    data: productsData,
    isLoading: isProductsLoading,
    isError,
  } = useProducts({
    page: currentPage,
    limit,
    isActive: true,
    search: search || undefined,
    categoryId,
  });

  // البحث والفلترة
  const handleSearch = (
    query: string,
    selectedCategoryId?: number
  ) => {
    setSearch(query);
    setCategoryId(selectedCategoryId);
    setCurrentPage(1);
  };

  const categories = categoriesData?.data ?? [];
  const products = productsData?.data ?? [];

  const totalPages = productsData?.meta?.totalPages ?? 1;

  // إنشاء أرقام الصفحات المعروضة
  const getVisiblePages = () => {
    const pages: number[] = [];

    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);

    for (let page = start; page <= end; page++) {
      pages.push(page);
    }

    return pages;
  };

  return (
    <main className="min-h-screen">
      <LeftCornerDecoration />
      <RightCornerDecoration />

      <section className="py-6">
        <SearchBar
          categories={categories}
          suggestions={suggestions}
          onSearch={handleSearch}
          onScanClick={() => {
            console.log("فتح ماسح الباركود");
          }}
        />
      </section>

      <section className="mx-auto w-full max-w-7xl px-3 pb-10 sm:px-6 lg:px-8">
        {isError ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center">
            <p className="text-sm font-bold text-red-500">
              حدث خطأ أثناء تحميل المنتجات
            </p>
          </div>
        ) : (
          <>
            <ProductGrid
              products={products}
              isLoading={isProductsLoading || isCategoriesLoading}
            />

            {/* Pagination */}
            {!isProductsLoading && totalPages > 1 && (
              <div
                className="mt-10 flex flex-wrap items-center justify-center gap-2"
                dir="rtl"
              >
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  aria-label="الصفحة الأولى"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition hover:border-[#004b79] hover:text-[#004b79] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <HiChevronDoubleRight className="h-5 w-5" />
                </button>

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  aria-label="الصفحة السابقة"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition hover:border-[#004b79] hover:text-[#004b79] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <HiChevronRight className="h-5 w-5" />
                </button>

                {getVisiblePages().map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    aria-current={currentPage === page ? "page" : undefined}
                    className={`flex h-10 min-w-10 items-center justify-center rounded-xl px-3 text-sm font-bold transition ${
                      currentPage === page
                        ? "bg-[#004b79] text-white shadow-md shadow-[#004b79]/20"
                        : "border border-gray-200 bg-white text-gray-600 hover:border-[#004b79] hover:text-[#004b79]"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(totalPages, prev + 1)
                    )
                  }
                  disabled={currentPage === totalPages}
                  aria-label="الصفحة التالية"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition hover:border-[#004b79] hover:text-[#004b79] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <HiChevronLeft className="h-5 w-5" />
                </button>

                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  aria-label="الصفحة الأخيرة"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition hover:border-[#004b79] hover:text-[#004b79] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <HiChevronDoubleLeft className="h-5 w-5" />
                </button>
              </div>
            )}

            {/* معلومات الصفحات */}
            {!isProductsLoading && products.length > 0 && (
              <p className="mt-4 text-center text-xs text-gray-400">
                الصفحة {currentPage} من {totalPages}
              </p>
            )}
          </>
        )}
      </section>
    </main>
  );
}
