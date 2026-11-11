"use client";

import { useState } from "react";

import SearchBar from "@/components/categories/SearchBar";
import CategoryGrid from "@/components/categories/category-grid";

import LeftCornerDecoration from "@/components/common/decoration/LeftCornerDecoration";
import RightCornerDecoration from "@/components/common/decoration/RightCornerDecoration";

import { useCategories } from "@/hooks/categories/use-categories";

import {
HiChevronRight,
HiChevronLeft,
HiChevronDoubleRight,
HiChevronDoubleLeft,
} from "react-icons/hi2";

export default function CategoriesPage() {
const [searchQuery, setSearchQuery] = useState("");
const [page, setPage] = useState(1);

const limit = 10;

const {
data,
isLoading,
isError,
isFetching,
} = useCategories({
page,
limit,
isActive: true,
search: searchQuery || undefined,
});

const categories = data?.data ?? [];
const meta = data?.meta;

const handleSearch = (query: string) => {
  setSearchQuery(query.trim());
  setPage(1);
};

const handleScan = () => {
console.log("فتح ماسح الباركود");
};

const handlePageChange = (newPage: number) => {
if (!meta) return;
if (newPage < 1 || newPage > meta.totalPages) return;
if (isFetching) return;

setPage(newPage);

window.scrollTo({
  top: 0,
  behavior: "smooth",
});

};

// أرقام الصفحات الظاهرة
const getVisiblePages = () => {
if (!meta) return [];

const start = Math.max(1, page - 2);
const end = Math.min(meta.totalPages, page + 2);

return Array.from(
  { length: end - start + 1 },
  (_, index) => start + index
);

};

return (
<div className="relative isolate w-full min-h-screen overflow-x-clip bg-[#faf9f7]">
<LeftCornerDecoration />
<RightCornerDecoration />

  {/* شريط البحث */}
  <section className="relative z-10 pb-4 pt-5 sm:pb-5">
    <SearchBar
      onSearch={handleSearch}
      onScanClick={handleScan}
    />
  </section>

  {/* عنوان الصفحة */}
  <section className="relative z-10 px-4 sm:px-6 lg:px-8 pt-3 pb-5">
    <div className="max-w-7xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-black text-[#004b79]">
        جميع الأصناف والتصنيفات
      </h1>

      <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
        تصفح تشكيلات جوهرة العرب المتكاملة للمنتجات بالجملة والتجزئة
      </p>
    </div>
  </section>

  {/* شبكة التصنيفات */}
  <main className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pb-24">

    {/* معلومات النتائج */}
    <div className="flex items-center justify-between mb-4 px-1">
      <span className="text-xs font-bold text-gray-600">
        إجمالي الأصناف: {meta?.total ?? 0}
      </span>

      {isFetching && !isLoading && (
        <span className="text-xs text-gray-400">
          جاري تحديث النتائج...
        </span>
      )}
    </div>

    {isError ? (
      <div className="bg-white rounded-3xl p-10 text-center border border-red-100 mt-4">
        <p className="text-sm font-bold text-red-500">
          حدث خطأ أثناء تحميل التصنيفات
        </p>

        <p className="text-xs text-gray-400 mt-2">
          يرجى المحاولة مرة أخرى
        </p>
      </div>
    ) : (
      <>
        <CategoryGrid
          categories={categories}
          isLoading={isLoading}
        />

        {/* Pagination بنفس تصميم صفحة المنتجات */}
        {!isLoading && meta && meta.totalPages > 1 && (
          <div
            className="mt-8 flex flex-wrap items-center justify-center gap-2"
            dir="rtl"
          >
            {/* أول صفحة */}
            <button
              type="button"
              onClick={() => handlePageChange(1)}
              disabled={page === 1 || isFetching}
              aria-label="الصفحة الأولى"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition hover:border-[#004b79] hover:text-[#004b79] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <HiChevronDoubleRight className="h-5 w-5" />
            </button>

            {/* السابق */}
            <button
              type="button"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1 || isFetching}
              aria-label="الصفحة السابقة"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition hover:border-[#004b79] hover:text-[#004b79] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <HiChevronRight className="h-5 w-5" />
            </button>

            {/* أرقام الصفحات */}
            {getVisiblePages().map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                onClick={() => handlePageChange(pageNumber)}
                disabled={isFetching}
                aria-current={page === pageNumber ? "page" : undefined}
                className={`flex h-10 min-w-10 items-center justify-center rounded-xl px-3 text-sm font-bold transition ${
                  page === pageNumber
                    ? "bg-[#004b79] text-white shadow-md shadow-[#004b79]/20"
                    : "border border-gray-200 bg-white text-gray-600 hover:border-[#004b79] hover:text-[#004b79]"
                } disabled:cursor-not-allowed disabled:opacity-50`}
              >
                {pageNumber}
              </button>
            ))}

            {/* التالي */}
            <button
              type="button"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === meta.totalPages || isFetching}
              aria-label="الصفحة التالية"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition hover:border-[#004b79] hover:text-[#004b79] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <HiChevronLeft className="h-5 w-5" />
            </button>

            {/* آخر صفحة */}
            <button
              type="button"
              onClick={() => handlePageChange(meta.totalPages)}
              disabled={page === meta.totalPages || isFetching}
              aria-label="الصفحة الأخيرة"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition hover:border-[#004b79] hover:text-[#004b79] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <HiChevronDoubleLeft className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* معلومات الصفحات */}
        {!isLoading && meta && meta.total > 0 && (
          <p className="mt-4 text-center text-[11px] text-gray-400">
            صفحة {page} من {meta.totalPages}
          </p>
        )}
      </>
    )}
  </main>
</div>

);
}