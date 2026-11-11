"use client";

import React from "react";
import Link from "next/link";

import { HiArrowLeft } from "react-icons/hi2";
import { FiLayers } from "react-icons/fi";

import { Category } from "@/types/category";
import { getImageUrl } from "@/lib/image-url";

interface CategoryGridProps {
  categories: Category[];
  isLoading?: boolean;
}

export default function CategoryGrid({
  categories,
  isLoading = false,
}: CategoryGridProps) {
  // Skeleton أثناء تحميل البيانات
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5 lg:gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-3 sm:p-4 border border-gray-100 animate-pulse"
          >
            <div className="w-full aspect-[4/5] bg-gray-100 rounded-xl mb-3" />

            <div className="h-3 bg-gray-100 rounded w-3/4 mb-3" />
            <div className="h-4 bg-gray-100 rounded w-full mb-2" />
            <div className="h-3 bg-gray-100 rounded w-5/6 mb-4" />

            <div className="h-9 bg-gray-100 rounded-xl" />
          </div>
        ))}
      </div>
    );
  }

  // لا توجد نتائج
  if (categories.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-xs mt-4">
        <FiLayers className="w-12 h-12 text-gray-300 mx-auto mb-3" />

        <h3 className="text-base font-bold text-gray-700">
          لا توجد أصناف مطابقة
        </h3>

        <p className="text-xs text-gray-400 mt-1">
          جرّب البحث باسم صنف آخر أو إفراغ خانة البحث
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5 lg:gap-6">
      {categories.map((cat) => (
        <div
          key={cat.id}
          className="group h-full bg-white rounded-2xl p-3 sm:p-4 border border-gray-200/80 hover:border-[#004b79]/40 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
        >
          {/* صورة التصنيف */}
          <div className="w-full aspect-[4/5] bg-[#faf9f7] rounded-xl flex items-center justify-center p-3 overflow-hidden mb-3">
            <img
              src={getImageUrl(cat.image)}
              alt={cat.name}
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = "/imgs/category-placeholder.png";
              }}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* تفاصيل التصنيف */}
          <div className="flex-1 flex flex-col justify-between mb-3">
            <div>
              {/* <div className="flex items-center gap-1.5 text-gray-400 text-[10px] sm:text-[11px] font-semibold mb-1.5">
                <FiLayers className="w-3.5 h-3.5 text-[#004b79]" />
                <span>صنف من جوهرة العرب</span>
              </div> */}

              <h2 className="text-xs sm:text-sm md:text-base font-bold text-gray-900 group-hover:text-[#004b79] transition-colors line-clamp-1 leading-snug mb-1">
                {cat.name}
              </h2>

              <p className="text-[10px] sm:text-xs text-gray-500 line-clamp-2 min-h-[30px] leading-relaxed">
                {cat.description || "لا يوجد وصف لهذا التصنيف"}
              </p>
            </div>
          </div>

          {/* زر عرض المنتجات */}
          <Link
            href={`/products?categoryId=${cat.id}`}
            className="w-full bg-[#f3f4f6] group-hover:bg-[#004b79] text-gray-800 group-hover:text-white font-bold text-xs sm:text-sm py-2 sm:py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 shadow-2xs"
          >
            <span>عرض المنتجات</span>
            <HiArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          </Link>
        </div>
      ))}
    </div>
  );
}