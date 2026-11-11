"use client";

import React from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import {
  HiArrowLeft,
  HiOutlineExclamationCircle,
  HiOutlineShoppingBag,
} from "react-icons/hi2";
import { FiLoader } from "react-icons/fi";

import { useProducts } from "@/hooks/products/use-products";
import { getImageUrl } from "@/lib/image-url";

import "swiper/css";
import "swiper/css/navigation";

export default function TopProductsSlider() {
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useProducts({
    page: 1,
    limit: 10,
    isActive: true,
  });

  const products = data?.data ?? [];

  return (
    <section className="my-6 w-full select-none px-3 sm:my-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* رأس القسم */}
        <div className="mb-5 flex items-center justify-between">
          <div className="text-right">
            <h3 className="text-lg font-bold text-[#004b79] sm:text-2xl">
              أحدث المنتجات
            </h3>

            <p className="mt-0.5 text-xs font-medium text-gray-500">
              اكتشف أحدث المنتجات المضافة إلى متجرنا
            </p>
          </div>

          <Link
            href="/products"
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold text-[#df6951] transition-colors hover:bg-[#df6951]/5 hover:text-[#c4533d] sm:text-sm"
          >
            <span>عرض الكل</span>
            <HiArrowLeft className="h-4 w-4" />
          </Link>
        </div>

        {/* حالة التحميل */}
        {isLoading && (
          <div className="flex items-center justify-center gap-3 py-16">
            <FiLoader className="h-6 w-6 animate-spin text-[#004b79]" />
            <span className="text-sm text-gray-500">
              جارٍ تحميل المنتجات...
            </span>
          </div>
        )}

        {/* حالة الخطأ */}
        {isError && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <HiOutlineExclamationCircle className="mb-3 h-10 w-10 text-red-400" />

            <p className="text-sm font-bold text-gray-700">
              تعذر تحميل المنتجات
            </p>

            <button
              onClick={() => refetch()}
              className="mt-3 text-sm font-bold text-[#004b79] hover:underline"
            >
              إعادة المحاولة
            </button>
          </div>
        )}

        {/* لا توجد منتجات */}
        {!isLoading && !isError && products.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <HiOutlineShoppingBag className="mb-3 h-12 w-12 text-gray-300" />

            <p className="text-sm font-bold text-gray-700">
              لا توجد منتجات حاليًا
            </p>

            <p className="mt-1 text-xs text-gray-400">
              ستظهر المنتجات الجديدة هنا عند إضافتها
            </p>
          </div>
        )}

        {/* السلايدر */}
        {!isLoading && !isError && products.length > 0 && (
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
            className="!px-1 !py-2"
          >
            {products.map((product) => (
              <SwiperSlide key={product.id} className="!h-auto">
                <div className="group flex h-full flex-col rounded-2xl border border-gray-200/80 bg-white p-3 transition-all duration-300 hover:border-[#004b79]/40 hover:shadow-lg sm:p-4">

                  {/* الصورة */}
                  <Link
                    href={`/products/${product.id}`}
                    className="mb-3 flex aspect-[4/5] w-full shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-50 p-2"
                  >
                    <img
                      src={getImageUrl(product.image)}
                      alt={product.name}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = "/imgs/product-placeholder.png";
                      }}
                      className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                  </Link>

                  {/* البيانات */}
                  <div className="flex flex-col text-right">

                    {/* التصنيف */}
                    <span className="mb-1 text-[11px] font-bold text-gray-400 line-clamp-1">
                      {product.category?.name || "بدون تصنيف"}
                    </span>

                    {/* اسم المنتج */}
                    <Link
                      href={`/products/${product.id}`}
                      className="mb-2 line-clamp-2 text-sm font-bold leading-5 text-gray-900 transition-colors hover:text-[#004b79]"
                    >
                      {product.name}
                    </Link>

                    {/* الوصف */}
                    <p className="mb-3 line-clamp-2 text-xs leading-5 text-gray-400">
                      {product.description || "اكتشف تفاصيل هذا المنتج"}
                    </p>
                  </div>

                  {/* زر التفاصيل */}
                  <Link
                    href={`/products/${product.id}`}
                    className="mt-auto block w-full rounded-xl bg-[#f3f4f6] py-2.5 text-center text-xs font-bold text-gray-800 transition-all duration-200 hover:bg-[#004b79] hover:text-white sm:text-sm"
                  >
                    عرض التفاصيل
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