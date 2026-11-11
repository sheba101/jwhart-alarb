"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  HiOutlineCube,
  HiOutlinePhoto,
  HiOutlinePlus,
  HiOutlinePlusCircle,
  HiOutlineTrash,
  HiOutlineXMark,
} from "react-icons/hi2";

import { useCategories } from "@/hooks/categories/use-categories";
import { useProductVariants } from "@/hooks/product-variants/use-product-variants";

import {
  useCreateProduct,
  useUpdateProduct,
} from "@/hooks/products/use-product";

import {
  useCreateProductVariant,
  useUpdateProductVariant,
  useDeleteProductVariant,
  useCreateVariantAttribute,
  useUpdateVariantAttribute,
  useDeleteVariantAttribute,
} from "@/hooks/product-variants/use-product-variant-mutations";

import { getImageUrl } from "@/lib/image-url";

import type { Product } from "@/types/product";

import type {
  CreateProductDto,
  UpdateProductDto,
} from "@/services/product.service";

import type {
  CreateProductVariantDto,
  UpdateProductVariantDto,
  CreateProductVariantAttributeDto,
  UpdateProductVariantAttributeDto,
} from "@/types/product-variant";

interface ProductFormProps {
  mode: "create" | "edit";
  product?: Product;
}

interface ProductFormValues {
  name: string;
  description: string;
  categoryId: string;
  isActive: boolean;
  image: File | null;
}

interface AttributeDraft {
  id?: number;
  name: string;
  value: string;
}

interface VariantDraft {
  id?: number;
  name: string;
  price: string;
  isAvailable: boolean;
  image: string | null;
  imageFile: File | null;
  imagePreview: string | null;
  attributes: AttributeDraft[];
}

const initialForm: ProductFormValues = {
  name: "",
  description: "",
  categoryId: "",
  isActive: true,
  image: null,
};

const emptyVariant = (): VariantDraft => ({
  name: "",
  price: "",
  isAvailable: true,
  image: null,
  imageFile: null,
  imagePreview: null,
  attributes: [],
});

const allowedImageTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
];

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

export default function ProductForm({
  mode,
  product,
}: ProductFormProps) {
  const router = useRouter();

  const isEdit = mode === "edit";

  // =====================================================
  // State
  // =====================================================

  const [form, setForm] = useState<ProductFormValues>(() => {
    if (!product) return initialForm;

    return {
      name: product.name,
      description: product.description ?? "",
      categoryId: String(product.categoryId),
      isActive: product.isActive,
      image: null,
    };
  });

  const [imagePreview, setImagePreview] = useState<string | null>(
    product?.image ? getImageUrl(product.image) : null
  );

  const [variants, setVariants] = useState<VariantDraft[]>([]);
  const [formError, setFormError] = useState("");

  // يسمح بتحميل الخيارات بعد إنشاء منتج جديد
  const [activeProductId, setActiveProductId] = useState<number | undefined>(
    product?.id
  );

  const [variantsInitialized, setVariantsInitialized] = useState(
    !isEdit
  );

  // =====================================================
  // Queries
  // =====================================================

  const {
    data: categoriesData,
    isLoading: isCategoriesLoading,
  } = useCategories({
    page: 1,
    limit: 100,
    isActive: true,
  });

  const {
    data: variantsData,
    isLoading: isVariantsLoading,
    isSuccess: isVariantsSuccess,
  } = useProductVariants(activeProductId);

  const categories = categoriesData?.data ?? [];

  // =====================================================
  // Mutations
  // =====================================================

  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();

  const createVariantMutation = useCreateProductVariant();
  const updateVariantMutation = useUpdateProductVariant();
  const deleteVariantMutation = useDeleteProductVariant();

  const createAttributeMutation = useCreateVariantAttribute();
  const updateAttributeMutation = useUpdateVariantAttribute();
  const deleteAttributeMutation = useDeleteVariantAttribute();

  const isSaving =
    createMutation.isPending ||
    updateMutation.isPending ||
    createVariantMutation.isPending ||
    updateVariantMutation.isPending ||
    deleteVariantMutation.isPending ||
    createAttributeMutation.isPending ||
    updateAttributeMutation.isPending ||
    deleteAttributeMutation.isPending;

  // =====================================================
  // Load Existing Variants
  // =====================================================

  useEffect(() => {
    if (
      !isEdit ||
      !activeProductId ||
      isVariantsLoading ||
      !isVariantsSuccess ||
      !variantsData ||
      variantsInitialized
    ) {
      return;
    }

    const mappedVariants: VariantDraft[] = variantsData.map(
      (variant) => ({
        id: variant.id,
        name: variant.name,
        price:
          variant.price === null || variant.price === undefined
            ? ""
            : String(variant.price),
        isAvailable: variant.isAvailable,
        image: variant.image,
        imageFile: null,
        imagePreview: variant.image
          ? getImageUrl(variant.image)
          : null,
        attributes: (variant.attributes ?? []).map((attribute) => ({
          id: attribute.id,
          name: attribute.name,
          value: attribute.value,
        })),
      })
    );

    setVariants(mappedVariants);
    setVariantsInitialized(true);
  }, [
    isEdit,
    activeProductId,
    isVariantsLoading,
    isVariantsSuccess,
    variantsData,
    variantsInitialized,
  ]);

  // =====================================================
  // Image Preview Cleanup
  // =====================================================

  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  useEffect(() => {
    return () => {
      variants.forEach((variant) => {
        if (variant.imagePreview?.startsWith("blob:")) {
          URL.revokeObjectURL(variant.imagePreview);
        }
      });
    };
  }, [variants]);

  // =====================================================
  // Product Image
  // =====================================================

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!allowedImageTypes.includes(file.type)) {
      setFormError("نوع صورة المنتج غير مدعوم");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setFormError("حجم الصورة يجب ألا يتجاوز 10 ميجابايت");
      event.target.value = "";
      return;
    }

    setForm((prev) => ({
      ...prev,
      image: file,
    }));

    setImagePreview(URL.createObjectURL(file));
    setFormError("");
  };

  // =====================================================
  // Variant Handlers
  // =====================================================

  const addVariant = () => {
    setVariants((prev) => [...prev, emptyVariant()]);
  };

  const removeVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const updateVariantField = (
    index: number,
    field: keyof VariantDraft,
    value: string | boolean
  ) => {
    setVariants((prev) =>
      prev.map((variant, i) =>
        i === index
          ? { ...variant, [field]: value }
          : variant
      )
    );
  };

  const handleVariantImageChange = (
    index: number,
    file: File | undefined
  ) => {
    if (!file) return;

    if (!allowedImageTypes.includes(file.type)) {
      setFormError("نوع صورة الخيار غير مدعوم");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setFormError("حجم صورة الخيار يجب ألا يتجاوز 10 ميجابايت");
      return;
    }

    const preview = URL.createObjectURL(file);

    setVariants((prev) =>
      prev.map((variant, i) =>
        i === index
          ? {
              ...variant,
              imageFile: file,
              imagePreview: preview,
            }
          : variant
      )
    );

    setFormError("");
  };

  // =====================================================
  // Attribute Handlers
  // =====================================================

  const addAttribute = (variantIndex: number) => {
    setVariants((prev) =>
      prev.map((variant, index) =>
        index === variantIndex
          ? {
              ...variant,
              attributes: [
                ...variant.attributes,
                { name: "", value: "" },
              ],
            }
          : variant
      )
    );
  };

  const removeAttribute = (
    variantIndex: number,
    attributeIndex: number
  ) => {
    setVariants((prev) =>
      prev.map((variant, index) =>
        index === variantIndex
          ? {
              ...variant,
              attributes: variant.attributes.filter(
                (_, i) => i !== attributeIndex
              ),
            }
          : variant
      )
    );
  };

  const updateAttributeField = (
    variantIndex: number,
    attributeIndex: number,
    field: keyof AttributeDraft,
    value: string
  ) => {
    setVariants((prev) =>
      prev.map((variant, index) =>
        index === variantIndex
          ? {
              ...variant,
              attributes: variant.attributes.map(
                (attribute, i) =>
                  i === attributeIndex
                    ? { ...attribute, [field]: value }
                    : attribute
              ),
            }
          : variant
      )
    );
  };

  // =====================================================
  // Validation
  // =====================================================

  const validateForm = (): boolean => {
    if (!form.name.trim()) {
      setFormError("يرجى إدخال اسم المنتج");
      return false;
    }

    if (!form.categoryId) {
      setFormError("يرجى اختيار تصنيف المنتج");
      return false;
    }

    for (let i = 0; i < variants.length; i++) {
      const variant = variants[i];

      if (!variant.name.trim()) {
        setFormError(`يرجى إدخال اسم الخيار رقم ${i + 1}`);
        return false;
      }

      if (!variant.id && !variant.imageFile) {
        setFormError(`يرجى اختيار صورة للخيار: ${variant.name}`);
        return false;
      }

      if (
        variant.price.trim() &&
        (!Number.isFinite(Number(variant.price)) ||
          Number(variant.price) < 0)
      ) {
        setFormError(
          `السعر المدخل للخيار ${variant.name} غير صحيح`
        );
        return false;
      }

      for (const attribute of variant.attributes) {
        if (!attribute.name.trim() || !attribute.value.trim()) {
          setFormError(
            `يرجى إكمال اسم وقيمة الخصائص في الخيار ${variant.name}`
          );
          return false;
        }
      }
    }

    return true;
  };

  // =====================================================
  // Save Variants and Attributes
  // =====================================================

  const saveVariants = async (productId: number) => {
    const existingVariants = variantsData ?? [];

    const currentVariantIds = variants
      .filter((variant) => variant.id)
      .map((variant) => variant.id as number);

    // Delete removed variants
    for (const oldVariant of existingVariants) {
      if (!currentVariantIds.includes(oldVariant.id)) {
        await deleteVariantMutation.mutateAsync({
          id: oldVariant.id,
          productId,
        });
      }
    }

    // Create / Update variants
    for (const variant of variants) {
      let variantId = variant.id;

      if (variant.id) {
        const updateData: UpdateProductVariantDto = {
          name: variant.name.trim(),
          price: variant.price.trim()
            ? Number(variant.price)
            : null,
          isAvailable: variant.isAvailable,
          ...(variant.imageFile
            ? { image: variant.imageFile }
            : {}),
        };

        await updateVariantMutation.mutateAsync({
          id: variant.id,
          productId,
          data: updateData,
        });
      } else {
        const createData: CreateProductVariantDto = {
          productId,
          name: variant.name.trim(),
          image: variant.imageFile!,
          price: variant.price.trim()
            ? Number(variant.price)
            : undefined,
          isAvailable: variant.isAvailable,
        };

        const createdVariant =
        await createVariantMutation.mutateAsync(createData);

        variantId = createdVariant.id;
      }

      if (!variantId) {
        throw new Error(
          "تعذر الحصول على رقم الخيار بعد إنشائه"
        );
      }

      const oldVariant = existingVariants.find(
        (item) => item.id === variantId
      );

      const oldAttributes = oldVariant?.attributes ?? [];

      const currentAttributeIds = variant.attributes
        .filter((attribute) => attribute.id)
        .map((attribute) => attribute.id as number);

      // Delete removed attributes
      for (const oldAttribute of oldAttributes) {
        if (!currentAttributeIds.includes(oldAttribute.id)) {
          await deleteAttributeMutation.mutateAsync({
            variantId,
            attributeId: oldAttribute.id,
            productId,
          });
        }
      }

      // Create / Update attributes
      for (const attribute of variant.attributes) {
        if (attribute.id) {
          const updateData: UpdateProductVariantAttributeDto = {
            name: attribute.name.trim(),
            value: attribute.value.trim(),
          };

          await updateAttributeMutation.mutateAsync({
            variantId,
            attributeId: attribute.id,
            productId,
            data: updateData,
          });
        } else {
          const createData: CreateProductVariantAttributeDto = {
            name: attribute.name.trim(),
            value: attribute.value.trim(),
          };

          await createAttributeMutation.mutateAsync({
            variantId,
            productId,
            data: createData,
          });
        }
      }
    }
  };

  // =====================================================
  // Submit
  // =====================================================

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setFormError("");

    if (!validateForm()) return;

    if (isEdit && !variantsInitialized) {
      setFormError("يرجى الانتظار حتى يتم تحميل خيارات المنتج");
      return;
    }

    const payload: CreateProductDto = {
      name: form.name.trim(),
      description: form.description.trim(),
      categoryId: Number(form.categoryId),
      isActive: form.isActive,
      ...(form.image ? { image: form.image } : {}),
    };

    try {
      let productId: number;

      if (isEdit && product) {
        const updatePayload: UpdateProductDto = payload;

        await updateMutation.mutateAsync({
          id: product.id,
          data: updatePayload,
        });

        productId = product.id;
      } else {
        const createdProduct =
          await createMutation.mutateAsync(payload);

        productId = createdProduct.id;

        setActiveProductId(productId);
      }

      await saveVariants(productId);

      router.push("/dashboard/products");
      router.refresh();
    } catch (error) {
      console.error("Product save error:", error);

      setFormError(
        "حدث خطأ أثناء حفظ المنتج أو الخيارات. تحقق من الاتصال بالـ API ثم حاول مرة أخرى."
      );
    }
  };

  // =====================================================
  // Render
  // =====================================================

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gray-100 rounded-2xl shadow-xs p-4 sm:p-6 space-y-6"
    >
      {/* Product Information */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <HiOutlineCube className="w-5 h-5 text-[#004b79]" />

          <h3 className="text-sm font-bold text-gray-800">
            بيانات المنتج الأساسية
          </h3>
        </div>

        {/* Product Image */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-2">
            صورة المنتج
          </label>

          <label className="relative flex flex-col items-center justify-center w-full h-40 bg-gray-50 border-2 border-dashed border-gray-200 hover:border-[#004b79]/50 rounded-xl cursor-pointer overflow-hidden transition-colors">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="معاينة المنتج"
                className="w-full h-full object-contain p-2"
              />
            ) : (
              <>
                <HiOutlinePhoto className="w-9 h-9 text-gray-300 mb-2" />

                <span className="text-xs font-semibold text-gray-500">
                  اضغط لاختيار صورة المنتج
                </span>

                <span className="text-[10px] text-gray-400 mt-1">
                  JPG, PNG, WebP, AVIF — حتى 10MB
                </span>
              </>
            )}

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Product Name */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-2">
            اسم المنتج <span className="text-red-500">*</span>
          </label>

          <input
            type="text"
            value={form.name}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
            placeholder="أدخل اسم المنتج"
            maxLength={150}
            required
            className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#004b79] focus:ring-2 focus:ring-[#004b79]/10"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-2">
            التصنيف <span className="text-red-500">*</span>
          </label>

          <select
            value={form.categoryId}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                categoryId: e.target.value,
              }))
            }
            required
            disabled={isCategoriesLoading}
            className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#004b79] disabled:opacity-60"
          >
            <option value="">
              {isCategoriesLoading
                ? "جاري تحميل التصنيفات..."
                : "اختر تصنيف المنتج"}
            </option>

            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-2">
            وصف المنتج
          </label>

          <textarea
            value={form.description}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            placeholder="أدخل وصف المنتج..."
            rows={3}
            maxLength={2000}
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none resize-none focus:border-[#004b79] focus:ring-2 focus:ring-[#004b79]/10"
          />
        </div>

        {/* Product Status */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
          <div>
            <p className="text-xs font-bold text-gray-700">
              حالة المنتج
            </p>

            <p className="text-[10px] text-gray-400 mt-1">
              تحديد ما إذا كان المنتج ظاهراً في المتجر
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
            className={`relative w-11 h-6 rounded-full transition-colors ${
              form.isActive ? "bg-[#004b79]" : "bg-gray-300"
            }`}
          >
            <span
              className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${
                form.isActive ? "right-1" : "right-6"
              }`}
            />
          </button>
        </div>
      </section>

      <div className="border-t border-gray-100" />

      {/* Variants */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-gray-800">
              خيارات المنتج (Variants)
            </h3>

            <p className="text-xs text-gray-400 mt-1">
              أضف الخيارات المختلفة لهذا المنتج، ولكل خيار صورته وخصائصه.
            </p>
          </div>

          <button
            type="button"
            onClick={addVariant}
            disabled={isEdit && !variantsInitialized}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#004b79]/10 text-[#004b79] hover:bg-[#004b79]/15 text-xs font-bold transition-colors disabled:opacity-50"
          >
            <HiOutlinePlus className="w-4 h-4" />
            إضافة خيار
          </button>
        </div>

        {isEdit && !variantsInitialized ? (
          <div className="py-8 text-center text-xs text-gray-400">
            جاري تحميل خيارات المنتج...
          </div>
        ) : variants.length === 0 ? (
          <div className="border border-dashed border-gray-200 rounded-xl p-7 text-center">
            <HiOutlineCube className="w-9 h-9 text-gray-300 mx-auto mb-2" />

            <p className="text-xs font-semibold text-gray-500">
              لا توجد خيارات لهذا المنتج
            </p>

            <p className="text-[11px] text-gray-400 mt-1">
              اضغط على إضافة خيار لإضافة أول خيار
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {variants.map((variant, index) => (
              <div
                key={variant.id ?? `new-${index}`}
                className="border border-gray-200 rounded-2xl p-4 space-y-4"
              >
                {/* Variant Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-[#004b79]/10 text-[#004b79] flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </span>

                    <h4 className="text-sm font-bold text-gray-800">
                      الخيار {index + 1}
                    </h4>

                    {variant.id && (
                      <span className="text-[10px] text-gray-400">
                        محفوظ
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => removeVariant(index)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-red-500 bg-red-50 hover:bg-red-100"
                    title="حذف الخيار"
                  >
                    <HiOutlineTrash className="w-4 h-4" />
                  </button>
                </div>

                {/* Variant Image */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2">
                    صورة الخيار <span className="text-red-500">*</span>
                  </label>

                  <label className="relative flex flex-col items-center justify-center w-full h-36 bg-gray-50 border-2 border-dashed border-gray-200 hover:border-[#004b79]/50 rounded-xl cursor-pointer overflow-hidden transition-colors">
                    {variant.imagePreview ? (
                      <img
                        src={variant.imagePreview}
                        alt={`صورة ${variant.name || "الخيار"}`}
                        className="w-full h-full object-contain p-2"
                      />
                    ) : (
                      <>
                        <HiOutlinePhoto className="w-8 h-8 text-gray-300 mb-2" />

                        <span className="text-xs font-semibold text-gray-500">
                          اضغط لاختيار صورة الخيار
                        </span>

                        <span className="text-[10px] text-gray-400 mt-1">
                          JPG, PNG, WebP, AVIF — حتى 10MB
                        </span>
                      </>
                    )}

                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/avif"
                      onChange={(e) =>
                        handleVariantImageChange(
                          index,
                          e.target.files?.[0]
                        )
                      }
                      className="hidden"
                    />
                  </label>

                  {variant.id && (
                    <p className="text-[10px] text-gray-400 mt-1">
                      إذا لم تختر صورة جديدة فستبقى الصورة الحالية.
                    </p>
                  )}
                </div>

                {/* Variant Name */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2">
                    اسم الخيار <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    value={variant.name}
                    onChange={(e) =>
                      updateVariantField(
                        index,
                        "name",
                        e.target.value
                      )
                    }
                    placeholder="مثال: الحجم الكبير، اللون الأحمر..."
                    maxLength={150}
                    className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#004b79]"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2">
                    السعر (اختياري)
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={variant.price}
                    onChange={(e) =>
                      updateVariantField(
                        index,
                        "price",
                        e.target.value
                      )
                    }
                    placeholder="أدخل السعر إن وجد"
                    className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#004b79]"
                  />
                </div>

                {/* Availability */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-xs font-bold text-gray-700">
                      توفر الخيار
                    </p>

                    <p className="text-[10px] text-gray-400 mt-1">
                      هل هذا الخيار متوفر حالياً؟
                    </p>
                  </div>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={variant.isAvailable}
                    onClick={() =>
                      updateVariantField(
                        index,
                        "isAvailable",
                        !variant.isAvailable
                      )
                    }
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      variant.isAvailable
                        ? "bg-[#004b79]"
                        : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${
                        variant.isAvailable
                          ? "right-1"
                          : "right-6"
                      }`}
                    />
                  </button>
                </div>

                {/* Attributes */}
                <div className="border-t border-gray-100 pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-xs font-bold text-gray-800">
                        خصائص الخيار (Attributes)
                      </h5>

                      <p className="text-[10px] text-gray-400 mt-1">
                        مثال: اللون: أسود، الحجم: XL
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => addAttribute(index)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#004b79] hover:text-[#00395d]"
                    >
                      <HiOutlinePlusCircle className="w-4 h-4" />
                      إضافة خاصية
                    </button>
                  </div>

                  {variant.attributes.length === 0 ? (
                    <p className="text-[11px] text-gray-400 bg-gray-50 rounded-lg p-3 text-center">
                      لا توجد خصائص مضافة لهذا الخيار
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {variant.attributes.map(
                        (attribute, attributeIndex) => (
                          <div
                            key={
                              attribute.id ??
                              `new-attribute-${index}-${attributeIndex}`
                            }
                            className="grid grid-cols-[1fr_1fr_36px] gap-2 items-center"
                          >
                            <input
                              type="text"
                              value={attribute.name}
                              onChange={(e) =>
                                updateAttributeField(
                                  index,
                                  attributeIndex,
                                  "name",
                                  e.target.value
                                )
                              }
                              placeholder="اسم الخاصية"
                              maxLength={100}
                              className="min-w-0 h-10 px-3 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:border-[#004b79]"
                            />

                            <input
                              type="text"
                              value={attribute.value}
                              onChange={(e) =>
                                updateAttributeField(
                                  index,
                                  attributeIndex,
                                  "value",
                                  e.target.value
                                )
                              }
                              placeholder="القيمة"
                              maxLength={255}
                              className="min-w-0 h-10 px-3 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:border-[#004b79]"
                            />

                            <button
                              type="button"
                              onClick={() =>
                                removeAttribute(
                                  index,
                                  attributeIndex
                                )
                              }
                              className="w-9 h-9 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100"
                              title="حذف الخاصية"
                            >
                              <HiOutlineXMark className="w-4 h-4" />
                            </button>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Error */}
      {formError && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-xs font-semibold p-3 rounded-xl">
          {formError}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col-reverse sm:flex-row items-center gap-3 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={() => router.push("/dashboard/products")}
          disabled={isSaving}
          className="w-full sm:flex-1 h-11 border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50 disabled:opacity-50"
        >
          إلغاء
        </button>

        <button
          type="submit"
          disabled={
            isSaving ||
            isCategoriesLoading ||
            (isEdit &&
              (!variantsInitialized || isVariantsLoading))
          }
          className="w-full sm:flex-1 h-11 bg-[#004b79] hover:bg-[#00395d] text-white rounded-xl text-sm font-bold transition-colors disabled:opacity-60"
        >
          {isSaving
            ? "جاري الحفظ..."
            : isEdit
              ? "حفظ التعديلات"
              : "إضافة المنتج"}
        </button>
      </div>
    </form>
  );
}