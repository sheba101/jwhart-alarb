"use client";

import React from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { HiArrowLeft } from "react-icons/hi2";

import { useCategories } from "@/hooks/categories/use-categories";
import { getImageUrl } from "@/lib/image-url";

import "swiper/css";
import "swiper/css/navigation";

export default function CategoriesSlider() {
  const { data, isLoading, isError } = useCategories({
    page: 1,
    limit: 10,
    isActive: true,
  });

  const categories = data?.data ?? [];

  return (
    <section className="my-6 w-full select-none px-3 sm:my-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-5 flex items-center justify-between">
          <div className="text-right">
            <h3 className="text-lg font-bold text-[#004b79] sm:text-2xl">
              تصفح حسب الأصناف
            </h3>

            <p className="mt-0.5 text-xs font-medium text-gray-500">
              استكشف مجموعات المنتجات المتاحة للشراء المباشر والجملة
            </p>
          </div>

          <Link
            href="/categories"
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold text-[#df6951] transition-colors hover:bg-[#df6951]/5 hover:text-[#c4533d] sm:text-sm"
          >
            <span>جميع الأصناف</span>
            <HiArrowLeft className="h-4 w-4" />
          </Link>
        </div>

        {/* LOADING */}
        {isLoading && (
          <div className="grid grid-cols-2 items-start gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="flex flex-col rounded-2xl border border-gray-100 bg-white p-3 animate-pulse sm:p-4"
              >
                <div className="mb-3 aspect-[4/5] w-full rounded-xl bg-gray-100" />
                <div className="mb-2 h-4 w-3/4 rounded bg-gray-100" />
                <div className="mb-2 h-3 w-full rounded bg-gray-100" />
                <div className="mt-3 h-9 rounded-xl bg-gray-100" />
              </div>
            ))}
          </div>
        )}

        {/* ERROR */}
        {isError && (
          <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center">
            <p className="text-sm text-red-500">
              تعذر تحميل التصنيفات، يرجى المحاولة لاحقاً.
            </p>
          </div>
        )}

        {/* EMPTY */}
        {!isLoading && !isError && categories.length === 0 && (
          <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center">
            <p className="text-sm text-gray-500">
              لا توجد تصنيفات متاحة حالياً.
            </p>
          </div>
        )}

        {/* CATEGORIES SLIDER */}
        {!isLoading && !isError && categories.length > 0 && (
          <Swiper
            modules={[Navigation]}
            dir="rtl"
            spaceBetween={12}
            slidesPerView={1.3}
            breakpoints={{
              480: { slidesPerView: 2.2, spaceBetween: 14 },
              768: { slidesPerView: 3.2, spaceBetween: 16 },
              1024: { slidesPerView: 4.2, spaceBetween: 18 },
              1280: { slidesPerView: 5, spaceBetween: 20 },
            }}
            className="categoriesSwiper !px-1 !py-2 [&_.swiper-wrapper]:!items-start"
          >
            {categories.map((cat) => (
              <SwiperSlide key={cat.id} className="!h-auto">
                <div className="group flex flex-col rounded-2xl border border-gray-200/80 bg-white p-3 shadow-xs transition-all duration-300 hover:border-[#004b79]/40 hover:shadow-lg sm:p-4">

                  {/* IMAGE */}
                  <div className="mb-3 flex aspect-[4/5] w-full shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#faf9f7] p-3">
                    <img
                      src={getImageUrl(cat.image)}
                      alt={cat.name}
                      loading="lazy"
                      className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  {/* CATEGORY INFO */}
                  <div className="text-right">
                    <h4 className="mb-1 line-clamp-1 text-sm font-bold leading-snug text-gray-900 transition-colors group-hover:text-[#004b79] sm:text-base">
                      {cat.name}
                    </h4>

                    <p className="line-clamp-2 overflow-hidden text-[11px] leading-5 text-gray-500">
                      {cat.description || "اكتشف المنتجات المتوفرة في هذا الصنف"}
                    </p>
                  </div>

                  {/* PRODUCTS LINK */}
                  <Link
                    href={`/products?categoryId=${cat.id}`}
                    className="mt-3 block w-full shrink-0 rounded-xl bg-[#f3f4f6] py-2.5 text-center text-xs font-bold text-gray-800 shadow-2xs transition-all duration-200 hover:bg-[#004b79] hover:text-white sm:text-sm"
                  >
                    عرض المنتجات
                  </Link>

                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}

      </div>
    </section>
  );
}