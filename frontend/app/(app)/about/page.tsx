

"use client";

import React from "react";
import {
  HiOutlinePhone,
  HiOutlineDevicePhoneMobile,
  HiOutlineEnvelope,
  HiOutlineMapPin,
  HiArrowTopRightOnSquare,
} from "react-icons/hi2";
import { FaWhatsapp } from "react-icons/fa";

import LeftCornerDecoration from "@/components/common/decoration/LeftCornerDecoration";
import RightCornerDecoration from "@/components/common/decoration/RightCornerDecoration";

/* =========================================
   بيانات المصنع والتواصل والموقع
========================================= */

// اسم المصنع
const STORE_NAME = "جوهرة العرب";

// النشاط التجاري
const BUSINESS_DESCRIPTION =
  "مصنع جوهرة العرب للأدوات والمنتجات البلاستيكية، متخصصون في تصنيع وتوريد العبوات والقوارير والبرطمانات البلاستيكية ومستلزمات التعبئة والتغليف، في المكلا - حضرموت - اليمن.";

// أرقام التواصل
const LANDLINE_PHONE = "05 353040";
const WHATSAPP_NUMBER = "967785149494";
const MOBILE_PHONE_DISPLAY = "+967 785 149 494";

// البريد الإلكتروني
const EMAIL = "Johartalarab@gmail.com";

// الموقع
const LOCATION_TEXT = "اليمن - حضرموت - المكلا - الشرج";
const MAP_LOCATION = "Al Sharj, Mukalla, Hadramout, Yemen";

// روابط التواصل
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

const MAP_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  MAP_LOCATION
)}`;

const MAP_EMBED_URL = `https://maps.google.com/maps?q=${encodeURIComponent(
  MAP_LOCATION
)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

// رمز QR
const QR_CODE_URL = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
  WHATSAPP_URL
)}`;

/* =========================================
   الصفحة
========================================= */

export default function AboutPage() {
  return (
    <div
      className="relative min-h-screen overflow-x-clip bg-[#faf9f7] pb-24 text-right"
      dir="rtl"
    >
      <LeftCornerDecoration />
      <RightCornerDecoration />

      <main className="relative z-10 mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-10">
        {/* بطاقة الهوية الرسمية */}
        <div className="relative mb-10 overflow-hidden rounded-3xl border border-[#e8d8c8]/80 bg-white p-6 shadow-[0_10px_35px_rgba(0,45,75,0.06)] transition-all sm:rounded-[36px] sm:p-12">
          {/* الزخرفة */}
          <div className="pointer-events-none absolute left-0 top-0 w-24 select-none opacity-90 sm:w-36 md:w-44">
            <img
              src="/shapes/dl.svg"
              alt=""
              className="h-auto w-full object-contain"
            />
          </div>

          {/* الشعار */}
          <div className="mb-10 mt-6 flex flex-col items-center justify-center text-center sm:mb-12 sm:mt-8">
            <div className="relative mb-4 h-24 w-24 sm:h-32 sm:w-32">
              <img
                src="/logo.png"
                alt={STORE_NAME}
                className="h-full w-full object-contain"
              />
            </div>

            <h1 className="text-2xl font-black leading-none tracking-tight text-[#004b79] sm:text-4xl">
              {STORE_NAME}
            </h1>

            <span className="mt-2 text-xs font-bold uppercase tracking-[0.22em] text-[#df6951] sm:text-sm">
              JOHART ALARAB
            </span>

            <p className="mt-4 max-w-md text-xs font-medium leading-relaxed text-gray-500 sm:text-sm">
              {BUSINESS_DESCRIPTION}
            </p>
          </div>

          {/* بيانات التواصل و QR */}
          <div className="mx-auto mb-8 flex max-w-md flex-row-reverse items-center justify-between gap-4 rounded-2xl border border-[#e8d8c8]/70 bg-[#faf9f7] p-4 shadow-sm sm:gap-6 sm:rounded-3xl sm:p-6">
            {/* QR Code */}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl border border-[#e8d8c8] bg-white p-2 shadow-sm transition-transform hover:scale-105 sm:h-28 sm:w-28 sm:rounded-2xl"
              aria-label="التواصل عبر واتساب"
            >
              <img
                src={QR_CODE_URL}
                alt="QR Code للتواصل عبر واتساب"
                className="h-full w-full object-contain"
              />
            </a>

            {/* معلومات الاتصال */}
            <div className="flex-1 space-y-2.5 text-right text-xs font-medium sm:text-sm">
              {/* الهاتف الثابت */}
              <div className="flex items-center gap-2.5 text-gray-700">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[#e8d8c8]/60 bg-white text-[#004b79]">
                  <HiOutlinePhone className="h-4 w-4" />
                </div>

                <a
                  href="tel:05353040"
                  className="transition-colors hover:text-[#004b79]"
                  dir="ltr"
                >
                  {LANDLINE_PHONE}
                </a>
              </div>

              {/* الجوال وواتساب */}
              <div className="flex items-center gap-2.5 text-[#004b79]">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[#e8d8c8]/60 bg-white">
                  <HiOutlineDevicePhoneMobile className="h-4 w-4" />
                </div>

                <a
                  href={`tel:+${WHATSAPP_NUMBER}`}
                  className="font-bold transition-colors hover:text-[#df6951]"
                  dir="ltr"
                >
                  {MOBILE_PHONE_DISPLAY}
                </a>
              </div>

              {/* البريد */}
              <div className="flex items-center gap-2.5 text-gray-700">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[#e8d8c8]/60 bg-white text-[#004b79]">
                  <HiOutlineEnvelope className="h-4 w-4" />
                </div>

                <a
                  href={`mailto:${EMAIL}`}
                  className="text-[11px] transition-colors hover:text-[#004b79] sm:text-xs"
                  dir="ltr"
                >
                  {EMAIL}
                </a>
              </div>

              {/* العنوان */}
              <div className="flex items-center gap-2.5 font-bold text-gray-800">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[#e8d8c8]/60 bg-[#f7efe6] text-[#df6951]">
                  <HiOutlineMapPin className="h-4 w-4" />
                </div>

                <span>{LOCATION_TEXT}</span>
              </div>
            </div>
          </div>

          {/* الرسوم الخطية */}
          <div className="flex w-full items-center justify-center border-t border-gray-100/80 pt-4 opacity-70">
            <svg
              className="h-12 w-full max-w-lg fill-none stroke-gray-400 sm:h-14"
              viewBox="0 0 500 60"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 55 L20 20 L25 15 L25 5 L35 5 L35 15 L40 20 L40 55 Z"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <rect
                x="55"
                y="22"
                width="28"
                height="33"
                rx="4"
                strokeWidth="1.5"
              />
              <rect
                x="52"
                y="16"
                width="34"
                height="6"
                rx="2"
                strokeWidth="1.5"
              />
              <path
                d="M100 55 L108 25 L116 25 L124 55 Z"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <rect
                x="110"
                y="18"
                width="4"
                height="7"
                strokeWidth="1.5"
              />
              <rect
                x="145"
                y="25"
                width="26"
                height="30"
                rx="3"
                strokeWidth="1.5"
              />
              <path
                d="M152 25 L150 10 M158 25 L158 8 M164 25 L166 12"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M195 28 L195 50 Q195 55 200 55 L235 55 Q240 55 240 50 L240 28 Z"
                strokeWidth="1.5"
              />
              <path
                d="M190 32 L195 32 M240 32 L245 32"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path d="M195 28 Q217 20 240 28" strokeWidth="1.5" />
              <circle cx="217" cy="21" r="2.5" strokeWidth="1.5" />
              <path
                d="M265 55 Q260 30 280 30 L295 30 Q315 30 310 55 Z"
                strokeWidth="1.5"
              />
              <path
                d="M268 40 Q258 36 260 30"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M305 32 Q320 38 308 48"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <ellipse
                cx="355"
                cy="48"
                rx="24"
                ry="7"
                strokeWidth="1.5"
              />
              <path
                d="M379 48 L410 40"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* قسم الموقع والتواصل */}
        <section className="overflow-hidden rounded-3xl border border-[#e8d8c8]/80 bg-white p-5 shadow-[0_8px_30px_rgba(0,45,75,0.04)] sm:p-8">
          {/* عنوان القسم */}
          <div className="mb-6 flex flex-col items-start justify-between gap-4 border-b border-gray-100 pb-5 sm:flex-row sm:items-center">
            <div>
              <span className="inline-flex rounded-full bg-[#df6951]/10 px-3 py-1 text-xs font-bold text-[#df6951]">
                موقعنا على الخريطة
              </span>

              <h2 className="mt-2 text-lg font-black text-[#004b79] sm:text-2xl">
                مصنع جوهرة العرب - المكلا
              </h2>

              <p className="mt-1 text-xs font-medium text-gray-500 sm:text-sm">
                موقع المصنع في الشرج - حضرموت، اليمن
              </p>
            </div>

            {/* أزرار التواصل */}
            <div className="flex w-full items-center gap-2 sm:w-auto">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#004b79] px-4 py-3 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#003b60] sm:flex-none sm:text-sm"
              >
                <FaWhatsapp className="h-4 w-4" />
                <span>تواصل معنا</span>
              </a>

              <a
                href={MAP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#e8d8c8] bg-[#f7efe6] px-4 py-3 text-xs font-bold text-[#004b79] transition-all hover:border-[#df6951] hover:bg-[#f2e5d7] sm:flex-none sm:text-sm"
              >
                <span>الموقع</span>
                <HiArrowTopRightOnSquare className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* الخريطة */}
          <div className="relative h-72 w-full overflow-hidden rounded-2xl border border-[#e8d8c8] bg-gray-100 sm:h-96">
            <iframe
              title={`موقع ${STORE_NAME} - ${LOCATION_TEXT}`}
              src={MAP_EMBED_URL}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full w-full"
            />
          </div>
        </section>
      </main>
    </div>
  );
}

