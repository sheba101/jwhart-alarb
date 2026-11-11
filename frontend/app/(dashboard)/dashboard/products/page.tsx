"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  HiOutlinePlus,
  HiOutlineMagnifyingGlass,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineCube,
  HiOutlineChevronRight,
  HiOutlineChevronLeft,
} from "react-icons/hi2";

import { useProducts } from "@/hooks/products/use-products";
import { useDeleteProduct } from "@/hooks/products/use-product";

import type { Product } from "@/types/product";
import { getImageUrl } from "@/lib/image-url";

type StatusFilter = "all" | "active" | "inactive";

export default function ProductsAdminPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("all");

  const [page, setPage] = useState(1);
  const limit = 10;

  const {
    data: productsData,
    isLoading,
    isError,
  } = useProducts({
    page,
    limit,
    search: search || undefined,
    isActive:
      statusFilter === "all"
        ? undefined
        : statusFilter === "active",
  });

  const deleteMutation = useDeleteProduct();

  const products = productsData?.data ?? [];
  const meta = productsData?.meta;

  const totalPages = meta?.totalPages ?? 1;
  const totalItems = meta?.total ?? 0;

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  const handleDelete = (product: Product) => {
    const confirmed = window.confirm(
      `هل أنت متأكد من حذف المنتج "${product.name}"؟`
    );

    if (confirmed) {
      deleteMutation.mutate(product.id);
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            إدارة المنتجات
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            إدارة المنتجات والخيارات والخصائص الخاصة بها
          </p>
        </div>

        <Link
          href="/dashboard/products/new"
          className="inline-flex items-center justify-center gap-2 bg-[#004b79] hover:bg-[#00395d] text-white px-5 py-3 rounded-xl text-sm font-bold transition-colors"
        >
          <HiOutlinePlus className="w-5 h-5" />
          إضافة منتج
        </Link>
      </div>

      {/* Search and Filter */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <HiOutlineMagnifyingGlass className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="البحث عن منتج..."
              className="w-full h-11 pr-10 pl-4 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#004b79] focus:ring-2 focus:ring-[#004b79]/10 transition-all"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as StatusFilter)
            }
            className="h-11 sm:w-48 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 outline-none focus:border-[#004b79]"
          >
            <option value="all">جميع المنتجات</option>
            <option value="active">المنتجات النشطة</option>
            <option value="inactive">المنتجات غير النشطة</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-xs overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <HiOutlineCube className="w-5 h-5 text-[#004b79]" />

            <h2 className="font-bold text-gray-800 text-sm">
              قائمة المنتجات
            </h2>
          </div>

          <span className="text-xs text-gray-500">
            {totalItems} منتج
          </span>
        </div>

        {isLoading ? (
          <div className="p-6 space-y-4 animate-pulse">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-16 bg-gray-100 rounded-xl"
              />
            ))}
          </div>
        ) : isError ? (
          <div className="p-12 text-center">
            <p className="text-sm text-red-500 font-semibold">
              حدث خطأ أثناء تحميل المنتجات
            </p>
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center">
            <HiOutlineCube className="w-12 h-12 text-gray-300 mx-auto mb-3" />

            <h3 className="text-sm font-bold text-gray-700">
              لا توجد منتجات
            </h3>

            <p className="text-xs text-gray-400 mt-1">
              لم يتم العثور على منتجات مطابقة للبحث
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-right min-w-[750px]">
                <thead className="bg-gray-50 text-gray-500 text-xs">
                  <tr>
                    <th className="px-5 py-4 font-semibold">المنتج</th>
                    <th className="px-5 py-4 font-semibold">التصنيف</th>
                    <th className="px-5 py-4 font-semibold">الخيارات</th>
                    <th className="px-5 py-4 font-semibold">الحالة</th>
                    <th className="px-5 py-4 font-semibold">تاريخ الإضافة</th>
                    <th className="px-5 py-4 font-semibold text-center">
                      الإجراءات
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-gray-50/70 transition-colors"
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={getImageUrl(product.image)}
                            alt={product.name}
                            onError={(e) => {
                              e.currentTarget.src =
                                "/imgs/product-placeholder.png";
                            }}
                            className="w-12 h-12 rounded-xl object-contain bg-gray-50 border border-gray-100 p-1"
                          />

                          <div>
                            <p className="text-sm font-bold text-gray-800">
                              {product.name}
                            </p>

                            <p className="text-xs text-gray-400 mt-1 max-w-[220px] truncate">
                              {product.description || "لا يوجد وصف"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-3">
                        <span className="text-xs font-semibold text-gray-600">
                          {product.category?.name || "غير محدد"}
                        </span>
                      </td>

                      <td className="px-5 py-3">
                        <span className="text-xs text-gray-600">
                          {product.variants?.length ?? 0} خيارات
                        </span>
                      </td>

                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            product.isActive
                              ? "bg-green-50 text-green-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              product.isActive
                                ? "bg-green-500"
                                : "bg-gray-400"
                            }`}
                          />

                          {product.isActive ? "نشط" : "غير نشط"}
                        </span>
                      </td>

                      <td className="px-5 py-3 text-xs text-gray-500">
                        {new Date(product.createdAt).toLocaleDateString(
                          "ar-YE"
                        )}
                      </td>

                      <td className="px-5 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            href={`/dashboard/products/${product.id}/edit`}
                            title="تعديل المنتج"
                            className="w-9 h-9 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                          >
                            <HiOutlinePencilSquare className="w-4 h-4" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleDelete(product)}
                            disabled={deleteMutation.isPending}
                            title="حذف المنتج"
                            className="w-9 h-9 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors disabled:opacity-50"
                          >
                            <HiOutlineTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                صفحة {page} من {totalPages} — إجمالي {totalItems} منتج
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((prev) => prev - 1)}
                  className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <HiOutlineChevronRight className="w-4 h-4" />
                </button>

                <span className="text-xs font-bold text-gray-700 min-w-8 text-center">
                  {page}
                </span>

                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((prev) => prev + 1)}
                  className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <HiOutlineChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}