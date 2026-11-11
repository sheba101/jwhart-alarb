"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { HiOutlineArrowRight } from "react-icons/hi2";

import { useProduct } from "@/hooks/products/use-products";
import ProductForm from "@/components/admin/products/ProductForm";

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const productId = Number(params.id);

  const {
    data: product,
    isLoading,
    isError,
  } = useProduct(productId);

  if (!Number.isInteger(productId) || productId <= 0) {
    return (
      <div className="p-8 text-center text-red-500" dir="rtl">
        رقم المنتج غير صحيح
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-8 text-center text-sm text-gray-500" dir="rtl">
        جاري تحميل بيانات المنتج...
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="space-y-4 p-8 text-center" dir="rtl">
        <p className="text-sm font-semibold text-red-500">
          تعذر تحميل المنتج
        </p>

        <Link
          href="/admin/products"
          className="text-sm text-[#004b79] font-bold"
        >
          العودة إلى المنتجات
        </Link>
      </div>
    );
  }

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
            تعديل المنتج
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            تعديل بيانات: {product.name}
          </p>
        </div>
      </div>

      <ProductForm
        mode="edit"
        product={product}
      />
    </div>
  );
}