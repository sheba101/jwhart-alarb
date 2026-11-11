"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  HiOutlinePlus,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineMagnifyingGlass,
  HiOutlineXMark,
  HiOutlinePhoto,
  HiOutlineTag,
  HiOutlineChevronRight,
  HiOutlineChevronLeft,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
} from "react-icons/hi2";
import { FiLoader } from "react-icons/fi";
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { useCategories } from "@/hooks/categories/use-categories";
import { categoryService } from "@/services/category.service";
import { getImageUrl } from "@/lib/image-url";
import type { Category } from "@/types/category";

type CategoryForm = {
  name: string;
  description: string;
  isActive: boolean;
  image: File | null;
};

const initialForm: CategoryForm = {
  name: "",
  description: "",
  isActive: true,
  image: null,
};

export default function AdminCategoriesPage() {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<Category | null>(null);

  const [form, setForm] = useState<CategoryForm>(initialForm);
  const [errorMessage, setErrorMessage] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const isActive =
    statusFilter === "all"
      ? undefined
      : statusFilter === "active";

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useCategories({
    page,
    limit: 10,
    search: search || undefined,
    isActive,
  });

  const categories = data?.data ?? [];
  const meta = data?.meta;

  // إضافة تصنيف
  const createMutation = useMutation({
    mutationFn: categoryService.create,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
      closeModal();
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        "حدث خطأ أثناء إضافة التصنيف";

      setErrorMessage(
        Array.isArray(message) ? message.join("، ") : message
      );
    },
  });

  // تعديل تصنيف
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: {
        name?: string;
        description?: string;
        isActive?: boolean;
        image?: File;
      };
    }) => categoryService.update(id, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
      closeModal();
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        "حدث خطأ أثناء تعديل التصنيف";

      setErrorMessage(
        Array.isArray(message) ? message.join("، ") : message
      );
    },
  });

  // حذف تصنيف
  const deleteMutation = useMutation({
    mutationFn: categoryService.delete,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
  });

  const isSaving =
    createMutation.isPending || updateMutation.isPending;

  // تنظيف رابط الصورة المؤقتة
  useEffect(() => {
    return () => {
      if (previewImage?.startsWith("blob:")) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setForm(initialForm);
    setErrorMessage("");
    setPreviewImage(null);
  };

  const openCreateModal = () => {
    setEditingCategory(null);
    setForm(initialForm);
    setErrorMessage("");
    setPreviewImage(null);
    setIsModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setForm({
      name: category.name,
      description: category.description ?? "",
      isActive: category.isActive,
      image: null,
    });
    setErrorMessage("");
    setPreviewImage(
      category.image ? getImageUrl(category.image) : null
    );
    setIsModalOpen(true);
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMessage("يرجى اختيار ملف صورة صالح");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("حجم الصورة يجب ألا يتجاوز 5 ميجابايت");
      return;
    }

    setErrorMessage("");
    setForm((prev) => ({ ...prev, image: file }));

    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    if (!form.name.trim()) {
      setErrorMessage("اسم التصنيف مطلوب");
      return;
    }

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      isActive: form.isActive,
      ...(form.image ? { image: form.image } : {}),
    };

    if (editingCategory) {
      updateMutation.mutate({
        id: editingCategory.id,
        data: payload,
      });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDelete = (category: Category) => {
    const confirmed = window.confirm(
      `هل أنت متأكد من حذف التصنيف "${category.name}"؟`
    );

    if (confirmed) {
      deleteMutation.mutate(category.id);
    }
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  const changeStatusFilter = (
    value: "all" | "active" | "inactive"
  ) => {
    setStatusFilter(value);
    setPage(1);
  };

  return (
    <div className="space-y-6">

      {/* عنوان الصفحة */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
            <HiOutlineTag className="w-4 h-4" />
            <span>إدارة المتجر</span>
            <span>/</span>
            <span className="text-[#004b79] font-bold">
              التصنيفات
            </span>
          </div>

          <h1 className="text-2xl font-black text-gray-800">
            التصنيفات
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            إدارة وتنظيم تصنيفات المنتجات في المتجر
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 bg-[#004b79] hover:bg-[#00385b] text-white px-5 py-3 rounded-xl text-sm font-bold transition-colors shadow-sm"
        >
          <HiOutlinePlus className="w-5 h-5" />
          إضافة تصنيف
        </button>
      </div>

      {/* إحصائيات مختصرة */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">
                إجمالي التصنيفات
              </p>
              <p className="text-2xl font-black text-gray-800 mt-2">
                {meta?.total ?? 0}
              </p>
            </div>

            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#004b79] flex items-center justify-center">
              <HiOutlineTag className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">
                التصنيفات النشطة
              </p>
              <p className="text-2xl font-black text-green-600 mt-2">
                {categories.filter((item) => item.isActive).length}
              </p>
            </div>

            <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
              <HiOutlineCheckCircle className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">
                التصنيفات غير النشطة
              </p>
              <p className="text-2xl font-black text-orange-500 mt-2">
                {categories.filter((item) => !item.isActive).length}
              </p>
            </div>

            <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
              <HiOutlineExclamationCircle className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* البحث والفلترة */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4">
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">

          <form
            onSubmit={handleSearch}
            className="relative flex-1 max-w-xl"
          >
            <HiOutlineMagnifyingGlass className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="ابحث عن تصنيف..."
              className="w-full bg-gray-50 border border-gray-200 focus:border-[#004b79] focus:bg-white rounded-xl py-3 pr-12 pl-4 text-sm outline-none transition-all"
            />
          </form>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-500 font-bold">
              الحالة:
            </span>

            {(
              [
                ["all", "الكل"],
                ["active", "نشط"],
                ["inactive", "غير نشط"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                onClick={() => changeStatusFilter(value)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
                  statusFilter === value
                    ? "bg-[#004b79] text-white"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* جدول التصنيفات */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">

        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-black text-gray-800">
            قائمة التصنيفات
          </h2>

          <span className="text-xs text-gray-400">
            {meta?.total ?? 0} تصنيف
          </span>
        </div>

        {isLoading ? (
          <div className="p-16 flex flex-col items-center justify-center gap-3">
            <FiLoader className="w-7 h-7 animate-spin text-[#004b79]" />
            <p className="text-sm text-gray-400">
              جارٍ تحميل التصنيفات...
            </p>
          </div>
        ) : isError ? (
          <div className="p-12 text-center">
            <HiOutlineExclamationCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
            <p className="text-sm font-bold text-gray-700">
              تعذر تحميل التصنيفات
            </p>
            <button
              onClick={() => refetch()}
              className="mt-4 text-sm font-bold text-[#004b79] hover:underline"
            >
              إعادة المحاولة
            </button>
          </div>
        ) : categories.length === 0 ? (
          <div className="p-16 text-center">
            <HiOutlineTag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="font-bold text-gray-700">
              لا توجد تصنيفات
            </p>
            <p className="text-sm text-gray-400 mt-1">
              لم يتم العثور على تصنيفات مطابقة لبحثك
            </p>
          </div>
        ) : (
          <>
            {/* عرض سطح المكتب */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-right">
                <thead>
                  <tr className="bg-gray-50 text-xs text-gray-500">
                    <th className="px-5 py-4 font-bold">التصنيف</th>
                    <th className="px-5 py-4 font-bold">الوصف</th>
                    <th className="px-5 py-4 font-bold">الحالة</th>
                    <th className="px-5 py-4 font-bold">تاريخ الإنشاء</th>
                    <th className="px-5 py-4 font-bold text-center">الإجراءات</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {categories.map((category) => (
                    <tr
                      key={category.id}
                      className="hover:bg-gray-50/70 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3 min-w-[190px]">
                          <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden relative shrink-0 border border-gray-100">
                            <Image
                              src={getImageUrl(category.image)}
                              alt={category.name}
                              fill
                              sizes="48px"
                              className="object-cover"
                              unoptimized
                            />
                          </div>

                          <div>
                            <p className="font-bold text-sm text-gray-800">
                              {category.name}
                            </p>
                            <p className="text-[11px] text-gray-400 mt-1">
                              #{category.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 max-w-[260px]">
                        <p className="text-xs text-gray-500 line-clamp-2">
                          {category.description || "لا يوجد وصف"}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge isActive={category.isActive} />
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-xs text-gray-500">
                          {new Date(category.createdAt).toLocaleDateString(
                            "ar"
                          )}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openEditModal(category)}
                            title="تعديل"
                            className="w-9 h-9 rounded-lg bg-blue-50 text-[#004b79] hover:bg-blue-100 flex items-center justify-center transition-colors"
                          >
                            <HiOutlinePencilSquare className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDelete(category)}
                            disabled={deleteMutation.isPending}
                            title="حذف"
                            className="w-9 h-9 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors disabled:opacity-50"
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

            {/* عرض الجوال */}
            <div className="md:hidden divide-y divide-gray-100">
              {categories.map((category) => (
                <div key={category.id} className="p-4">
                  <div className="flex gap-3">
                    <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden relative shrink-0">
                      <Image
                        src={getImageUrl(category.image)}
                        alt={category.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                        unoptimized
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="font-bold text-sm text-gray-800 truncate">
                            {category.name}
                          </h3>
                          <p className="text-[11px] text-gray-400 mt-1">
                            #{category.id}
                          </p>
                        </div>

                        <StatusBadge isActive={category.isActive} />
                      </div>

                      <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                        {category.description || "لا يوجد وصف"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <span className="text-[11px] text-gray-400">
                      {new Date(category.createdAt).toLocaleDateString("ar")}
                    </span>

                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(category)}
                        className="px-3 py-2 rounded-lg bg-blue-50 text-[#004b79] text-xs font-bold flex items-center gap-1"
                      >
                        <HiOutlinePencilSquare className="w-4 h-4" />
                        تعديل
                      </button>

                      <button
                        onClick={() => handleDelete(category)}
                        disabled={deleteMutation.isPending}
                        className="px-3 py-2 rounded-lg bg-red-50 text-red-500 text-xs font-bold flex items-center gap-1"
                      >
                        <HiOutlineTrash className="w-4 h-4" />
                        حذف
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-5 py-4 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              الصفحة {meta.page} من {meta.totalPages}
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={page <= 1}
                className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="الصفحة السابقة"
              >
                <HiOutlineChevronRight className="w-4 h-4" />
              </button>

              {Array.from(
                { length: meta.totalPages },
                (_, index) => index + 1
              ).map((pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => setPage(pageNumber)}
                  className={`w-9 h-9 rounded-lg text-xs font-bold transition-colors ${
                    page === pageNumber
                      ? "bg-[#004b79] text-white"
                      : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {pageNumber}
                </button>
              ))}

              <button
                onClick={() =>
                  setPage((prev) =>
                    Math.min(meta.totalPages, prev + 1)
                  )
                }
                disabled={page >= meta.totalPages}
                className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="الصفحة التالية"
              >
                <HiOutlineChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* نافذة الإضافة والتعديل */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !isSaving) {
              closeModal();
            }
          }}
        >
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">

            {/* رأس النافذة */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-black text-gray-800">
                  {editingCategory ? "تعديل التصنيف" : "إضافة تصنيف جديد"}
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  أدخل بيانات التصنيف الأساسية
                </p>
              </div>

              <button
                onClick={closeModal}
                disabled={isSaving}
                className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500"
              >
                <HiOutlineXMark className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-5">

              {/* الصورة */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  صورة التصنيف
                </label>

                <label className="relative flex flex-col items-center justify-center w-full h-44 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 hover:bg-gray-100 cursor-pointer overflow-hidden transition-colors">
                  {previewImage ? (
                    <>
                      <Image
                        src={previewImage}
                        alt="معاينة الصورة"
                        fill
                        sizes="450px"
                        className="object-contain p-2"
                        unoptimized
                      />
                      <span className="absolute bottom-2 bg-black/60 text-white text-[11px] px-3 py-1.5 rounded-lg">
                        اضغط لتغيير الصورة
                      </span>
                    </>
                  ) : (
                    <>
                      <HiOutlinePhoto className="w-9 h-9 text-gray-300 mb-2" />
                      <span className="text-sm font-bold text-gray-500">
                        اضغط لاختيار صورة
                      </span>
                      <span className="text-[11px] text-gray-400 mt-1">
                        PNG أو JPG أو WEBP - حتى 5MB
                      </span>
                    </>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>

              {/* الاسم */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  اسم التصنيف <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  required
                  maxLength={100}
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="مثال: علب وبرطمانات شفافة"
                  className="w-full bg-gray-50 border border-gray-200 focus:border-[#004b79] focus:bg-white rounded-xl px-4 py-3 text-sm outline-none transition-all"
                />
              </div>

              {/* الوصف */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  وصف التصنيف
                </label>

                <textarea
                  rows={3}
                  maxLength={500}
                  value={form.description}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="اكتب وصفًا مختصرًا للتصنيف..."
                  className="w-full resize-none bg-gray-50 border border-gray-200 focus:border-[#004b79] focus:bg-white rounded-xl px-4 py-3 text-sm outline-none transition-all"
                />

                <p className="text-[10px] text-gray-400 text-left mt-1">
                  {form.description.length}/500
                </p>
              </div>

              {/* الحالة */}
              <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
                <div>
                  <p className="text-sm font-bold text-gray-700">
                    حالة التصنيف
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    تحديد ظهور التصنيف في المتجر
                  </p>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={form.isActive}
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      isActive: !prev.isActive,
                    }))
                  }
                  className={`w-12 h-6 rounded-full relative transition-colors ${
                    form.isActive ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                      form.isActive ? "right-1" : "right-7"
                    }`}
                  />
                </button>
              </div>

              {/* رسالة الخطأ */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-bold">
                  {errorMessage}
                </div>
              )}

              {/* أزرار النافذة */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isSaving}
                  className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 disabled:opacity-50"
                >
                  إلغاء
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 py-3 rounded-xl bg-[#004b79] hover:bg-[#00385b] text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isSaving ? (
                    <>
                      <FiLoader className="w-4 h-4 animate-spin" />
                      جارٍ الحفظ...
                    </>
                  ) : editingCategory ? (
                    "حفظ التعديلات"
                  ) : (
                    "إضافة التصنيف"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

// شارة حالة التصنيف
function StatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap ${
        isActive
          ? "bg-green-50 text-green-700"
          : "bg-gray-100 text-gray-500"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          isActive ? "bg-green-500" : "bg-gray-400"
        }`}
      />
      {isActive ? "نشط" : "غير نشط"}
    </span>
  );
}