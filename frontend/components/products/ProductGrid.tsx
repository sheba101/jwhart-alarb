"use client";

import React from "react";
import Link from "next/link";

import { HiArrowLeft } from "react-icons/hi2";
import { FiPackage } from "react-icons/fi";

import type { Product } from "@/types/product";
import { getImageUrl } from "@/lib/image-url";

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
}

export default function ProductGrid({
  products,
  isLoading = false,
}: ProductGridProps) {
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
  if (products.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-xs mt-4">
        <FiPackage className="w-12 h-12 text-gray-300 mx-auto mb-3" />

        <h3 className="text-base font-bold text-gray-700">
          لا توجد منتجات مطابقة
        </h3>

        <p className="text-xs text-gray-400 mt-1">
          جرّب البحث باسم منتج آخر أو تغيير التصنيف
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5 lg:gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="group h-full bg-white rounded-2xl p-3 sm:p-4 border border-gray-200/80 hover:border-[#004b79]/40 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
        >
          {/* صورة المنتج */}
          <div className="w-full aspect-[4/5] bg-[#faf9f7] rounded-xl flex items-center justify-center p-3 overflow-hidden mb-3">
            <img
              src={getImageUrl(product.image)}
              alt={product.name}
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = "/imgs/product-placeholder.png";
              }}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* تفاصيل المنتج */}
          <div className="flex-1 flex flex-col justify-between mb-3">
            <div>
              {product.category?.name && (
                <div className="text-[10px] sm:text-[11px] font-semibold text-[#004b79] mb-1.5">
                  {product.category.name}
                </div>
              )}

              <h2 className="text-xs sm:text-sm md:text-base font-bold text-gray-900 group-hover:text-[#004b79] transition-colors line-clamp-1 leading-snug mb-1">
                {product.name}
              </h2>

              <p className="text-[10px] sm:text-xs text-gray-500 line-clamp-2 min-h-[30px] leading-relaxed">
                {product.description || "لا يوجد وصف لهذا المنتج"}
              </p>

              {product.variants && product.variants.length > 0 && (
                <p className="text-[10px] text-gray-400 mt-2">
                  {product.variants.length} خيارات متاحة
                </p>
              )}
            </div>
          </div>

          {/* زر عرض التفاصيل */}
          <Link
            href={`/products/${product.id}`}
            className="w-full bg-[#f3f4f6] group-hover:bg-[#004b79] text-gray-800 group-hover:text-white font-bold text-xs sm:text-sm py-2 sm:py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 shadow-2xs"
          >
            <span>عرض التفاصيل</span>
            <HiArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          </Link>
        </div>
      ))}
    </div>
  );
}