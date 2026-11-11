"use client";

import React from "react";

export default function HomeBackgroundPatterns() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none -z-10 select-none"
    >
      {/* 1. شبكة نقوش هندسية دقيقة (SVG Pattern مستوحى من زوايا الجوهرة) */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.035]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="jewel-diamond-pattern"
            width="48"
            height="48"
            patternUnits="userSpaceOnUse"
          >
            {/* معين هندسي مستوحى من شكل الجوهرة */}
            <path
              d="M24 0L48 24L24 48L0 24Z"
              fill="none"
              stroke="#004b79"
              strokeWidth="1"
            />
            {/* خطوط داخلية دقيقة */}
            <path
              d="M24 8L40 24L24 40L8 24Z"
              fill="none"
              stroke="#d6a87c"
              strokeWidth="0.75"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#jewel-diamond-pattern)" />
      </svg>

      {/* 2. هالة رملية خافتة خلف السلايدر وشريط البحث في الأعلى */}
      <div className="absolute -top-32 right-[-8%] w-[420px] sm:w-[600px] h-[420px] sm:h-[600px] rounded-full bg-[#d6a87c]/12 blur-[100px]" />

      {/* 3. توهج أزرق كحلي ناعم بين سكشن المنتجات والأصناف */}
      <div className="absolute top-[45%] left-[-10%] w-[380px] sm:w-[550px] h-[380px] sm:h-[550px] rounded-full bg-[#004b79]/8 blur-[120px]" />

      {/* 4. إضاءة رملية دافئة أسفل الصفحة */}
      <div className="absolute -bottom-24 right-[-5%] w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] rounded-full bg-[#d6a87c]/15 blur-[110px]" />
    </div>
  );
}