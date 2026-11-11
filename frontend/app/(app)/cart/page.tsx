
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  HiArrowRight,
  HiTrash,
  HiPlus,
  HiMinus,
  HiOutlineShoppingBag,
  HiOutlineBuildingStorefront,
  HiOutlineTruck,
  HiOutlineDocumentText,
  HiOutlineIdentification,
  HiOutlineCube,
} from "react-icons/hi2";

import { FaWhatsapp } from "react-icons/fa";

import LeftCornerDecoration from "@/components/common/decoration/LeftCornerDecoration";
import RightCornerDecoration from "@/components/common/decoration/RightCornerDecoration";

import { useCartStore } from "@/stores/cart-store";
import { getImageUrl } from "@/lib/image-url";

export default function CartPage() {
  const router = useRouter();

  // بيانات السلة من Zustand
  const items = useCartStore((state) => state.items);
  const hasHydrated = useCartStore((state) => state.hasHydrated);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore(
    (state) => state.updateQuantity
  );
  const clearCart = useCartStore((state) => state.clearCart);

  // بيانات المشتري
  const [companyName, setCompanyName] = useState("");
  const [city, setCity] = useState("");
  const [notes, setNotes] = useState("");

  // مجموع القطع
  const totalUnits = items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // تعديل الكمية
  const handleQuantityChange = (
    productId: number,
    variantId: number | null,
    delta: number
  ) => {
    const item = items.find(
      (item) =>
        item.productId === productId &&
        item.variantId === variantId
    );

    if (!item) return;

    updateQuantity(
      productId,
      variantId,
      Math.max(1, item.quantity + delta)
    );
  };

  // إرسال الاستفسار عبر واتساب
  const handleSendWhatsApp = () => {
    if (items.length === 0) {
      alert("السلة فارغة، أضف المنتجات أولًا.");
      return;
    }

    let message = `*طلب استفسار من متجر جوهرة العرب*\n`;
    message += `━━━━━━━━━━━━━━━━━━\n\n`;

    if (companyName.trim()) {
      message += `*اسم المشتري / الشركة:* ${companyName.trim()}\n`;
    }

    if (city.trim()) {
      message += `*المدينة:* ${city.trim()}\n`;
    }

    if (notes.trim()) {
      message += `*ملاحظات:* ${notes.trim()}\n`;
    }

    message += `\n━━━━━━━━━━━━━━━━━━\n`;
    message += `*المنتجات المطلوبة:*\n\n`;

    items.forEach((item, index) => {
      message += `${index + 1}. *${item.productName}*\n`;

      if (item.variantName) {
        message += `   النسخة: ${item.variantName}\n`;
      }

      message += `   الكمية: ${item.quantity}\n\n`;
    });

    message += `━━━━━━━━━━━━━━━━━━\n`;
    message += `*إجمالي القطع:* ${totalUnits}\n`;
    message += `\nنرجو مراجعة توفر المنتجات وتزويدنا بالتفاصيل.`;

    const encodedMessage = encodeURIComponent(message);

    // استبدل الرقم برقم واتساب المتجر الفعلي
    const whatsappNumber = "967785149494";

    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodedMessage}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // انتظار تحميل بيانات localStorage
  if (!hasHydrated) {
    return (
      <main
        dir="rtl"
        className="min-h-screen bg-[#faf9f7] px-4 py-20 text-center"
      >
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#e8d8c8] border-t-[#004b79]" />
        <p className="mt-4 text-sm font-medium text-gray-500">
          جاري تحميل سلة التسوق...
        </p>
      </main>
    );
  }

  return (
    <div
      className="relative min-h-screen overflow-x-clip bg-[#faf9f7] pb-24 text-right"
      dir="rtl"
    >
      {/* الزخارف الجانبية */}
      <LeftCornerDecoration />
      <RightCornerDecoration />

      <main className="relative z-10 mx-auto max-w-lg px-4 py-4 sm:max-w-xl sm:py-6">

        {/* Header */}
        <div className="mb-5 flex items-center justify-between border-b border-[#e8d8c8]/50 py-3">

          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-full p-1.5 text-[#004b79] transition-colors hover:bg-[#f7efe6]"
            aria-label="العودة"
          >
            <HiArrowRight className="h-5 w-5" />
          </button>

          <div className="text-center">
            <h1 className="text-lg font-black text-[#004b79] sm:text-xl">
              حقيبة التسوق
            </h1>

            <span className="text-[11px] font-bold text-gray-500">
              ({items.length} منتجات)
            </span>
          </div>

          {items.length > 0 ? (
            <button
              type="button"
              onClick={() => {
                if (window.confirm("هل تريد إفراغ السلة بالكامل؟")) {
                  clearCart();
                }
              }}
              className="text-xs font-bold text-rose-500 transition hover:text-rose-700"
            >
              إفراغ السلة
            </button>
          ) : (
            <div className="w-12" />
          )}
        </div>

        {/* Empty Cart */}
        {items.length === 0 ? (
          <div className="rounded-3xl border border-[#e8d8c8]/70 bg-white px-5 py-14 text-center shadow-sm">

            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#004b79]/[0.07]">
              <HiOutlineShoppingBag className="h-10 w-10 text-[#004b79]" />
            </div>

            <h2 className="mb-2 text-xl font-black text-[#004b79]">
              سلتك فارغة
            </h2>

            <p className="mb-7 text-sm leading-7 text-gray-500">
              لم تقم بإضافة أي منتجات إلى سلة التسوق حتى الآن.
              تصفح منتجاتنا واختر ما يناسبك.
            </p>

            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#004b79] px-7 py-3 text-sm font-bold text-white transition hover:bg-[#00385b]"
            >
              <HiOutlineShoppingBag className="h-5 w-5" />
              تصفح المنتجات
            </Link>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="mb-6 space-y-3">

              {items.map((item) => {
                const imagePath =
                  item.variantImage || item.productImage;

                const imageUrl = imagePath
                  ? getImageUrl(imagePath)
                  : null;

                return (
                  <div
                    key={`${item.productId}-${item.variantId ?? "default"}`}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-[#e8d8c8]/70 bg-white p-3.5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all sm:p-4"
                  >
                    {/* Product Details */}
                    <div className="min-w-0 flex-1">

                      <Link
                        href={`/products/${item.productId}`}
                        className="mb-1.5 line-clamp-2 text-xs font-bold leading-snug text-gray-900 transition hover:text-[#004b79] sm:text-[13px]"
                      >
                        {item.productName}
                      </Link>

                      {/* Variant */}
                      {item.variantName && (
                        <div className="mb-2 flex items-center gap-1.5 text-[11px] text-gray-500">
                          <HiOutlineCube className="h-3.5 w-3.5 text-[#d6a87c]" />
                          <span>
                            النسخة: {item.variantName}
                          </span>
                        </div>
                      )}

                      {/* Quantity Controls */}
                      <div className="mt-3 flex items-center gap-3">

                        {/* Remove */}
                        <button
                          type="button"
                          onClick={() =>
                            removeItem(
                              item.productId,
                              item.variantId
                            )
                          }
                          className="rounded-lg p-1.5 text-gray-400 transition hover:bg-rose-50 hover:text-rose-500"
                          title="حذف المنتج"
                          aria-label="حذف المنتج"
                        >
                          <HiTrash className="h-4 w-4" />
                        </button>

                        {/* Quantity */}
                        <div className="flex items-center rounded-lg bg-[#004b79] px-2 py-0.5 text-white shadow-sm">

                          <button
                            type="button"
                            onClick={() =>
                              handleQuantityChange(
                                item.productId,
                                item.variantId,
                                -1
                              )
                            }
                            disabled={item.quantity <= 1}
                            aria-label="تقليل الكمية"
                            className="p-1 transition hover:text-[#d6a87c] active:scale-90 disabled:cursor-not-allowed disabled:opacity-30"
                          >
                            <HiMinus className="h-3.5 w-3.5" />
                          </button>

                          <span className="min-w-9 select-none px-2 text-center text-xs font-bold">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              handleQuantityChange(
                                item.productId,
                                item.variantId,
                                1
                              )
                            }
                            aria-label="زيادة الكمية"
                            className="p-1 transition hover:text-[#d6a87c] active:scale-90"
                          >
                            <HiPlus className="h-3.5 w-3.5" />
                          </button>

                        </div>
                      </div>
                    </div>

                    {/* Product Image */}
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-100 bg-[#faf9f7] p-2 sm:h-24 sm:w-24">

                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={item.productName}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <HiOutlineCube className="h-9 w-9 text-gray-300" />
                      )}

                    </div>
                  </div>
                );
              })}
            </div>

            {/* Buyer Information */}
            <div className="relative mb-6 rounded-3xl border border-[#e8d8c8]/70 bg-white p-5 shadow-sm">

              {/* Section Title */}
              <div className="-mt-8 mb-5 flex justify-center">
                <div className="flex items-center gap-2 rounded-full bg-[#004b79] px-6 py-2 text-xs font-bold text-white shadow-md sm:text-sm">
                  <HiOutlineIdentification className="h-4 w-4 text-[#d6a87c]" />
                  <span>معلومات المشتري</span>
                </div>
              </div>

              <div className="space-y-3.5 pt-1">

                {/* Company Name */}
                <div>
                  <label className="mb-1 mr-1 block text-[11px] font-bold text-gray-700">
                    اسم الشركة / اسم المشتري
                  </label>

                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) =>
                        setCompanyName(e.target.value)
                      }
                      placeholder="مثال: متجر الوفاء للتجارة"
                      className="w-full rounded-xl border border-[#e8d8c8] bg-[#faf9f7] py-2.5 pl-3 pr-9 text-xs font-medium text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:border-[#004b79] sm:text-sm"
                    />

                    <HiOutlineBuildingStorefront className="pointer-events-none absolute right-3 h-4 w-4 text-gray-400" />
                  </div>
                </div>

                {/* City */}
                <div>
                  <label className="mb-1 mr-1 block text-[11px] font-bold text-gray-700">
                    المدينة
                  </label>

                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="مثال: سيئون / المكلا"
                      className="w-full rounded-xl border border-[#e8d8c8] bg-[#faf9f7] py-2.5 pl-3 pr-9 text-xs font-medium text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:border-[#004b79] sm:text-sm"
                    />

                    <HiOutlineTruck className="pointer-events-none absolute right-3 h-4 w-4 text-gray-400" />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="mb-1 mr-1 block text-[11px] font-bold text-gray-700">
                    ملاحظات إضافية (اختياري)
                  </label>

                  <div className="relative flex items-start">
                    <textarea
                      rows={3}
                      value={notes}
                      onChange={(e) =>
                        setNotes(e.target.value)
                      }
                      placeholder="اكتب أي تفاصيل إضافية..."
                      className="w-full resize-none rounded-xl border border-[#e8d8c8] bg-[#faf9f7] py-2.5 pl-3 pr-9 text-xs font-medium text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:border-[#004b79]"
                    />

                    <HiOutlineDocumentText className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Cart Summary */}
            <div className="mb-5 rounded-2xl border border-[#e8d8c8] bg-[#f7efe6] p-4">

              <div className="flex items-center justify-between gap-3">

                <div>
                  <p className="text-xs font-bold text-gray-600">
                    عدد المنتجات المختلفة
                  </p>

                  <p className="mt-1 text-lg font-black text-[#004b79]">
                    {items.length}
                  </p>
                </div>

                <div className="text-left">
                  <p className="text-xs font-bold text-gray-600">
                    إجمالي القطع
                  </p>

                  <p className="mt-1 text-lg font-black text-[#004b79]">
                    {totalUnits}
                  </p>
                </div>

              </div>
            </div>

            {/* WhatsApp Button */}
            <button
              type="button"
              onClick={handleSendWhatsApp}
              className="flex h-14 w-full items-center justify-center gap-2.5 rounded-2xl bg-[#004b79] text-sm font-bold text-white shadow-lg shadow-[#004b79]/20 transition-all hover:bg-[#00385b] active:scale-[0.99] sm:text-base"
            >
              <span>إرسال الاستفسار عبر الواتساب</span>
              <FaWhatsapp className="h-6 w-6 text-[#25D366]" />
            </button>

            <p className="mt-2 text-center text-[10px] font-medium text-gray-400">
              سيتم إرسال المنتجات والكميات وبيانات المشتري إلى واتساب المتجر.
            </p>
          </>
        )}

      </main>
    </div>
  );
}
