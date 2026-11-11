"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  HiOutlineUserCircle,
  HiOutlineSquares2X2,
  HiOutlineHome,
  HiHome,
  HiOutlineSquaresPlus,
  HiSquaresPlus,
  HiOutlineInformationCircle,
  HiInformationCircle,
  HiOutlineShoppingBag,
  HiShoppingBag,
} from "react-icons/hi2";

import { useCartStore } from "@/stores/cart-store";
export default function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const pathname = usePathname();

  const items = useCartStore((state) => state.items);
const hasHydrated = useCartStore((state) => state.hasHydrated);

const cartCount = items.reduce(
  (total, item) => total + item.quantity,
  0
);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsAuthenticated(!!token);
  }, []);

  const navLinks = [
    {
      label: "الرئيسية",
      href: "/",
      outlineIcon: HiOutlineHome,
      solidIcon: HiHome,
    },
    {
      label: "الأصناف",
      href: "/categories",
      outlineIcon: HiOutlineSquares2X2,
      solidIcon: HiOutlineSquares2X2,
    },
    {
      label: "المنتجات",
      href: "/products",
      outlineIcon: HiOutlineSquaresPlus,
      solidIcon: HiSquaresPlus,
    },
    {
      label: "عنا",
      href: "/about",
      outlineIcon: HiOutlineInformationCircle,
      solidIcon: HiInformationCircle,
    },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#e8d8c8]/60 bg-white/95 shadow-[0_2px_15px_-3px_rgba(0,45,75,0.04)] backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between sm:h-20">

          {/* 1. الشعار (LOGO) */}
          <Link
            href="/"
            className="group flex shrink-0 items-center gap-2.5 sm:gap-3"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center sm:h-12 sm:w-12">
              <img
                src="/logo.png"
                alt="جوهرة العرب"
                className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            <div className="flex select-none flex-col text-right">
              <span className="font-arabic text-xl font-black leading-none tracking-tight text-[#004b79] sm:text-2xl">
                جوهرة العرب
              </span>

              <span className="mt-1 font-arabic text-[10px] font-bold uppercase leading-none tracking-[0.18em] text-[#df6951] sm:text-xs">
                JOHART ALARAB
              </span>
            </div>
          </Link>

          {/* 2. شريط التنقل بالديسكتوب (DESKTOP NAVIGATION) */}
          <nav className="hidden items-center gap-1.5 rounded-full border border-[#e8d8c8]/80 bg-[#f7efe6]/60 p-1.5 backdrop-blur-xs lg:flex">
            {navLinks.map((item) => {
              const active = isActive(item.href);
              const Icon = active ? item.solidIcon : item.outlineIcon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`group relative flex items-center gap-2 rounded-full px-5 py-2 text-xs sm:text-sm font-bold transition-all duration-300 ${
                    active
                      ? "bg-[#004b79] text-white shadow-md shadow-[#004b79]/20"
                      : "text-gray-700 hover:bg-white hover:text-[#004b79] hover:shadow-2xs"
                  }`}
                >
                  <Icon className={`h-4.5 w-4.5 transition-transform duration-200 ${active ? "text-[#d6a87c]" : "text-gray-500 group-hover:text-[#004b79]"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* 3. الإجراءات والأزرار (ACTIONS) */}
          <div className="flex shrink-0 items-center gap-2.5 sm:gap-3">

            {/* زر السلة للديسكتوب */}
            <Link
              href="/cart"
              aria-label="عربة التسوق"
              aria-current={isActive("/cart") ? "page" : undefined}
              className={`group relative hidden items-center gap-2.5 rounded-full border px-4 py-2 text-xs sm:text-sm font-bold transition-all duration-200 lg:flex ${
                isActive("/cart")
                  ? "border-[#004b79] bg-[#004b79] text-white shadow-md shadow-[#004b79]/20"
                  : "border-[#e8d8c8] bg-white text-gray-800 hover:border-[#004b79] hover:bg-[#f7efe6]/50 hover:text-[#004b79]"
              }`}
            >
              <div className="relative flex items-center">
                {isActive("/cart") ? (
                  <HiShoppingBag className="h-5 w-5 text-[#d6a87c]" />
                ) : (
                  <HiOutlineShoppingBag className="h-5 w-5 text-gray-600 group-hover:text-[#004b79] transition-colors" />
                )}

                {hasHydrated && cartCount > 0 && (
  <span className="absolute -left-2.5 -top-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#df6951] px-1 text-[10px] font-black text-white ring-2 ring-white">
    {cartCount > 99 ? "99+" : cartCount}
  </span>
)}
              </div>

              <span>السلة</span>
            </Link>

            {/* زر الحساب أو لوحة التحكم */}
            {isAuthenticated ? (
              <Link
                href="/dashboard/products"
                aria-label="لوحة التحكم"
                title="لوحة التحكم"
                className="flex items-center gap-2 rounded-full bg-[#004b79] hover:bg-[#00385b] px-3.5 py-2 text-xs font-bold text-white shadow-sm shadow-[#004b79]/20 transition-all active:scale-95 sm:px-4"
              >
                <HiOutlineSquares2X2 className="h-5 w-5 text-[#d6a87c]" />
                <span className="hidden sm:inline">لوحة التحكم</span>
              </Link>
            ) : (
              <Link
                href="/admin/login"
                aria-label="تسجيل الدخول"
                title="تسجيل الدخول للإدارة"
                className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-[#e8d8c8] bg-[#f7efe6]/60 text-[#004b79] transition-all duration-200 hover:border-[#004b79] hover:bg-white hover:shadow-xs active:scale-95"
              >
                <HiOutlineUserCircle className="h-6 w-6 sm:h-7 sm:w-7" />
              </Link>
            )}

          </div>

        </div>
      </div>
    </header>
  );
}