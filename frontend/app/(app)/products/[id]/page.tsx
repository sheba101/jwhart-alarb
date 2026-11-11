
"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import {
  HiOutlineCube,
  HiOutlineChevronLeft,
  HiOutlinePlus,
  HiOutlineMinus,
  HiCheck,
  HiOutlineShoppingBag,
} from "react-icons/hi2";

import { useCartStore } from "@/stores/cart-store";
import { useProduct } from "@/hooks/products/use-products";
import { useProductVariants } from "@/hooks/product-variants/use-product-variants";
import { getImageUrl } from "@/lib/image-url";

function ProductDetailsContent() {
  const params = useParams();
  const productId = Number(params.id);

  const {
    data: product,
    isLoading: productLoading,
    isError: productError,
  } = useProduct(productId);

  const {
    data: variants,
    isLoading: variantsLoading,
  } = useProductVariants(productId);

  const [selectedVariantId, setSelectedVariantId] =
    useState<number | null>(null);

  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const addItem = useCartStore((state) => state.addItem);

  const hasVariants = (variants?.length ?? 0) > 0;

  // اختيار أول نسخة متوفرة تلقائيًا
  useEffect(() => {
    if (!variants?.length) {
      setSelectedVariantId(null);
      return;
    }

    const firstAvailable = variants.find(
      (variant) => variant.isAvailable
    );

    setSelectedVariantId(
      firstAvailable?.id ?? variants[0].id
    );
  }, [variants]);

  const selectedVariant = useMemo(
    () =>
      variants?.find(
        (variant) => variant.id === selectedVariantId
      ),
    [variants, selectedVariantId]
  );

  // الصورة الرئيسية حسب النسخة المحددة
  const currentImage = hasVariants
    ? selectedVariant?.image || product?.image
    : product?.image;

  const imageUrl = currentImage
    ? getImageUrl(currentImage)
    : null;

  // صورة النسخة مع الرجوع لصورة المنتج
  const getVariantImageUrl = (image?: string | null) => {
    const imagePath = image || product?.image;
    return imagePath ? getImageUrl(imagePath) : null;
  };

  // حالة التوفر
  const isAvailable = hasVariants
    ? selectedVariant?.isAvailable ?? false
    : product?.isActive ?? false;

  // إمكانية الإضافة للسلة
  const canAddToCart =
    !variantsLoading &&
    (hasVariants
      ? !!selectedVariant && selectedVariant.isAvailable
      : !!product?.isActive);

  // إضافة المنتج إلى السلة
  const handleAddToCart = () => {
    if (!product || !canAddToCart) return;

    addItem({
      productId: product.id,
      productName: product.name,
      productImage: product.image ?? null,

      variantId: hasVariants ? selectedVariant!.id : null,
      variantName: hasVariants ? selectedVariant!.name : null,
      variantImage: hasVariants
        ? selectedVariant!.image ?? null
        : null,

      quantity,
    });

    setAddedToCart(true);

    setTimeout(() => {
      setAddedToCart(false);
    }, 2000);
  };

  // زيادة الكمية
  const increaseQuantity = () => {
    setQuantity((current) => current + 1);
  };

  // إنقاص الكمية مع عدم النزول عن 1
  const decreaseQuantity = () => {
    setQuantity((current) => Math.max(1, current - 1));
  };

  // شاشة التحميل
  if (productLoading) {
    return (
      <main
        dir="rtl"
        className="min-h-screen bg-[#faf9f7] px-4 py-12"
      >
        <div className="mx-auto max-w-lg animate-pulse space-y-6">
          <div className="h-5 w-36 rounded bg-gray-200" />
          <div className="aspect-square rounded-3xl bg-gray-200" />
          <div className="h-8 w-3/4 rounded bg-gray-200" />
          <div className="h-24 rounded-2xl bg-gray-200" />
        </div>
      </main>
    );
  }

  // حالة الخطأ
  if (productError || !product) {
    return (
      <main
        dir="rtl"
        className="flex min-h-[70vh] items-center justify-center bg-[#faf9f7] px-4"
      >
        <div className="max-w-md text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#df6951]/10 text-3xl font-black text-[#df6951]">
            !
          </div>

          <h1 className="mb-2 text-2xl font-black text-[#004b79]">
            لم يتم العثور على المنتج
          </h1>

          <p className="mb-6 text-sm font-medium text-gray-500">
            قد يكون المنتج غير متوفر حاليًا أو تم حذفه.
          </p>

          <Link
            href="/products"
            className="inline-flex rounded-2xl bg-[#004b79] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#00395b]"
          >
            العودة إلى المنتجات
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#faf9f7] pb-12 text-right"
    >
      <div className="mx-auto max-w-lg px-4 py-5 sm:max-w-xl sm:py-7">

        {/* Breadcrumb */}
        <nav className="mb-5 flex items-center gap-1.5 text-xs font-medium text-gray-400">
          <Link
            href="/"
            className="transition hover:text-[#004b79]"
          >
            الرئيسية
          </Link>

          <HiOutlineChevronLeft className="h-3 w-3 text-gray-300" />

          <Link
            href="/products"
            className="transition hover:text-[#004b79]"
          >
            المنتجات
          </Link>

          <HiOutlineChevronLeft className="h-3 w-3 text-gray-300" />

          <span className="max-w-[180px] truncate font-bold text-[#004b79]">
            {product.name}
          </span>
        </nav>

        {/* Product Image */}
        <section>
          <div className="relative flex min-h-[300px] items-center justify-center overflow-hidden rounded-3xl border border-[#e8d8c8]/70 bg-white p-6 shadow-sm sm:min-h-[360px] sm:p-10">
            {imageUrl ? (
              <img
                key={imageUrl}
                src={imageUrl}
                alt={selectedVariant?.name || product.name}
                className="max-h-[320px] w-full object-contain transition duration-500"
              />
            ) : (
              <div className="flex flex-col items-center gap-3 text-gray-300">
                <HiOutlineCube className="h-16 w-16 stroke-[1.2]" />
                <span className="text-xs">
                  لا توجد صورة لهذا المنتج
                </span>
              </div>
            )}

            {/* Availability */}
            <div className="absolute right-4 top-4">
              <span
                className={`rounded-full px-3 py-1.5 text-[11px] font-bold ${
                  isAvailable
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-rose-50 text-rose-600"
                }`}
              >
                {isAvailable ? "متوفر" : "غير متوفر"}
              </span>
            </div>
          </div>

          {/* Variant Images */}
          {!variantsLoading && hasVariants && (
            <div className="mt-4">
              <p className="mb-3 text-xs font-bold text-gray-600">
                صور النسخ
              </p>

              <div className="flex flex-wrap gap-3">
                {variants?.map((variant) => {
                  const isSelected =
                    selectedVariantId === variant.id;

                  const variantImage = getVariantImageUrl(
                    variant.image
                  );

                  return (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() =>
                        setSelectedVariantId(variant.id)
                      }
                      title={variant.name}
                      aria-label={`اختيار ${variant.name}`}
                      aria-pressed={isSelected}
                      className={`relative h-[76px] w-[76px] overflow-hidden rounded-2xl border-2 bg-white transition-all sm:h-20 sm:w-20 ${
                        isSelected
                          ? "border-[#004b79] shadow-md ring-2 ring-[#004b79]/10"
                          : "border-[#e8d8c8] hover:border-[#004b79]/50"
                      }`}
                    >
                      {variantImage ? (
                        <img
                          src={variantImage}
                          alt={variant.name}
                          className="h-full w-full object-contain p-2"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-gray-300">
                          <HiOutlineCube className="h-8 w-8" />
                        </div>
                      )}

                      {isSelected && (
                        <span className="absolute left-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#004b79] text-white">
                          <HiCheck className="h-3 w-3" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        {/* Product Details */}
        <section className="mt-5 overflow-hidden rounded-3xl border border-[#e8d8c8]/70 bg-white shadow-sm">
          <div className="p-5 sm:p-6">

            {/* Category */}
            {product.category?.name && (
              <div className="mb-3">
                <span className="inline-flex rounded-lg bg-[#004b79]/[0.07] px-3 py-1.5 text-[11px] font-bold text-[#004b79]">
                  {product.category.name}
                </span>
              </div>
            )}

            {/* Product Name */}
            <h1 className="mb-3 text-xl font-black leading-snug text-[#004b79] sm:text-2xl">
              {product.name}
            </h1>

            {/* Description */}
            <p className="text-sm font-medium leading-7 text-gray-500">
              {product.description ||
                "لا يوجد وصف متاح لهذا المنتج حاليًا."}
            </p>

            {/* Product ID */}
            <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
              <span>رمز المنتج:</span>
              <span className="font-bold text-gray-600">
                JA-PROD-{product.id}
              </span>
            </div>

            <div className="my-5 h-px bg-[#eee9e4]" />

            {/* Variants */}
            {variantsLoading ? (
              <div className="animate-pulse space-y-3">
                <div className="h-5 w-28 rounded bg-gray-200" />
                <div className="h-12 rounded-xl bg-gray-200" />
              </div>
            ) : hasVariants ? (
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-sm font-bold text-gray-800">
                    اختر النسخة
                  </h2>

                  <span className="text-xs text-gray-400">
                    {variants?.length} نسخ
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {variants?.map((variant) => {
                    const isSelected =
                      selectedVariantId === variant.id;

                    return (
                      <button
                        key={variant.id}
                        type="button"
                        onClick={() =>
                          setSelectedVariantId(variant.id)
                        }
                        className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold transition ${
                          isSelected
                            ? "border-[#004b79] bg-[#004b79] text-white shadow-sm"
                            : "border-[#e8d8c8] bg-[#faf9f7] text-gray-700 hover:border-[#004b79]"
                        } ${
                          !variant.isAvailable
                            ? "opacity-60"
                            : ""
                        }`}
                      >
                        <span>{variant.name}</span>

                        {isSelected && (
                          <HiCheck className="h-4 w-4" />
                        )}

                        {!variant.isAvailable && (
                          <span className="text-[10px]">
                            غير متوفر
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Selected Variant Attributes */}
                {selectedVariant?.attributes?.length ? (
                  <div className="mt-5">
                    <h3 className="mb-3 text-xs font-bold text-gray-700">
                      مواصفات النسخة
                    </h3>

                    <div className="grid grid-cols-2 gap-2">
                      {selectedVariant.attributes.map((attribute) => (
                        <div
                          key={attribute.id}
                          className="rounded-xl border border-[#e8d8c8]/70 bg-[#faf9f7] p-3"
                        >
                          <p className="mb-1 text-[10px] text-gray-400">
                            {attribute.name}
                          </p>

                          <p className="text-xs font-bold text-gray-800">
                            {attribute.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="flex items-center gap-3 rounded-xl bg-[#faf9f7] p-4">
                <HiOutlineCube className="h-6 w-6 text-[#004b79]" />

                <div>
                  <p className="text-sm font-bold text-[#004b79]">
                    منتج مباشر
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    لا توجد نسخ متعددة لهذا المنتج
                  </p>
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mt-6 border-t border-[#eee9e4] pt-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-gray-800">
                    الكمية المطلوبة
                  </h2>
                  <p className="mt-1 text-[11px] text-gray-400">
                    حدد عدد القطع المطلوبة
                  </p>
                </div>

                <div className="flex h-11 items-center overflow-hidden rounded-xl border border-[#e8d8c8] bg-[#faf9f7]">
                  <button
                    type="button"
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                    aria-label="تقليل الكمية"
                    className="flex h-full w-11 items-center justify-center text-[#004b79] transition hover:bg-[#004b79]/10 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <HiOutlineMinus className="h-4 w-4" />
                  </button>

                  <span
                    className="flex h-full min-w-12 items-center justify-center border-x border-[#e8d8c8] bg-white text-sm font-black text-[#004b79]"
                    aria-live="polite"
                  >
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={increaseQuantity}
                    aria-label="زيادة الكمية"
                    className="flex h-full w-11 items-center justify-center text-[#004b79] transition hover:bg-[#004b79]/10"
                  >
                    <HiOutlinePlus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Availability */}
            <div className="mt-5 flex items-center gap-2">
              <span
                className={`h-2 w-2 rounded-full ${
                  isAvailable ? "bg-emerald-500" : "bg-rose-500"
                }`}
              />

              <span className="text-xs font-medium text-gray-500">
                {isAvailable
                  ? "هذا المنتج متوفر حاليًا"
                  : "هذا المنتج غير متوفر حاليًا"}
              </span>
            </div>

            {/* Add to Cart */}
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!canAddToCart}
              className={`mt-5 flex h-13 w-full items-center justify-center gap-2 rounded-2xl px-5 text-sm font-bold text-white shadow-md transition active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none ${
                addedToCart
                  ? "bg-emerald-600 hover:bg-emerald-600"
                  : "bg-[#004b79] shadow-[#004b79]/15 hover:bg-[#00395b]"
              }`}
            >
              {addedToCart ? (
                <>
                  <HiCheck className="h-5 w-5" />
                  <span>تمت الإضافة للسلة</span>
                </>
              ) : (
                <>
                  <HiOutlineShoppingBag className="h-5 w-5" />
                  <span>إضافة للسلة</span>
                </>
              )}
            </button>

          </div>
        </section>

      </div>
    </main>
  );
}

export default function ProductDetailsPage() {
  return (
    <Suspense
      fallback={
        <main
          dir="rtl"
          className="min-h-screen bg-[#faf9f7] px-4 py-12"
        >
          <div className="mx-auto max-w-lg animate-pulse space-y-6">
            <div className="h-5 w-36 rounded bg-gray-200" />
            <div className="aspect-square rounded-3xl bg-gray-200" />
            <div className="h-8 w-3/4 rounded bg-gray-200" />
            <div className="h-24 rounded-2xl bg-gray-200" />
          </div>
        </main>
      }
    >
      <ProductDetailsContent />
    </Suspense>
  );
}
