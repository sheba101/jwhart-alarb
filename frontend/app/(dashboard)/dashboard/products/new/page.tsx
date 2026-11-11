"use client";

import Link from "next/link";
import { HiOutlineArrowRight } from "react-icons/hi2";

import ProductForm from "@/components/admin/products/ProductForm";

export default function NewProductPage() {
  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/products"
          className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50"
          title="العودة للمنتجات"
        >
          <HiOutlineArrowRight className="w-5 h-5" />
        </Link>

        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            إضافة منتج جديد
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            أدخل بيانات المنتج والخيارات والخصائص
          </p>
        </div>
      </div>

      <ProductForm mode="create" />
    </div>
  );
}