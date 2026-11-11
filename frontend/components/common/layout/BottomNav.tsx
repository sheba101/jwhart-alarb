"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  HiOutlineHome,
  HiHome,
  HiOutlineSquares2X2,
  HiSquares2X2,
  HiOutlineShoppingBag,
  HiShoppingBag,
  HiOutlineCube,
  HiCube,
  HiOutlineInformationCircle,
  HiInformationCircle,
} from "react-icons/hi2";
import { useCartStore } from "@/stores/cart-store";

export default function BottomNav() {
  const pathname = usePathname();

  // اربط هذا العدد لاحقاً مع Zustand أو حالة السلة الفعلية
  const items = useCartStore((state) => state.items);
const hasHydrated = useCartStore((state) => state.hasHydrated);

const cartCount = items.reduce(
  (total, item) => total + item.quantity,
  0
);

  const navItems = [
    {
      id: "home",
      label: "الرئيسية",
      href: "/",
      outlineIcon: HiOutlineHome,
      solidIcon: HiHome,
    },
    {
      id: "categories",
      label: "الأصناف",
      href: "/categories",
      outlineIcon: HiOutlineSquares2X2,
      solidIcon: HiSquares2X2,
    },
    {
      id: "products",
      label: "المنتجات",
      href: "/products",
      outlineIcon: HiOutlineCube,
      solidIcon: HiCube,
    },
    {
      id: "about",
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

  const renderNavItem = (item: (typeof navItems)[number]) => {
    const active = isActive(item.href);
    const Icon = active ? item.solidIcon : item.outlineIcon;

    return (
      <Link
        key={item.id}
        href={item.href}
        aria-current={active ? "page" : undefined}
        className="flex flex-1 select-none flex-col items-center justify-center py-1 transition-transform active:scale-95"
      >
        <div
          className={`flex items-center justify-center transition-all duration-200 ${
            active
              ? "h-10 w-10 -translate-y-1 rounded-full bg-[#004b79] text-white shadow-sm"
              : "h-8 w-8 text-gray-500 hover:text-[#004b79]"
          }`}
        >
          <Icon className={active ? "h-5 w-5" : "h-6 w-6"} />
        </div>

        <span
          className={`mt-0.5 text-[10px] font-bold tracking-tight ${
            active ? "text-[#004b79]" : "text-gray-500"
          }`}
        >
          {item.label}
        </span>
      </Link>
    );
  };

  const cartActive = isActive("/cart");

  return (
    <nav
      aria-label="التنقل السفلي"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-100 bg-white shadow-[0_-4px_25px_rgba(0,0,0,0.08)] lg:hidden"
    >
      <div className="relative mx-auto flex h-16 max-w-md items-center justify-between px-2">

        {/* الرئيسية والأصناف */}
        <div className="flex flex-1 items-center justify-around">
          {navItems.slice(0, 2).map(renderNavItem)}
        </div>

        {/* السلة في المنتصف */}
        <div className="flex shrink-0 flex-col items-center justify-center px-2">
          <Link
            href="/cart"
            aria-label="عربة التسوق"
            aria-current={cartActive ? "page" : undefined}
            className="group relative -top-5 flex flex-col items-center"
          >
            <div
              className={`relative flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg shadow-[#004b79]/30 ring-4 ring-white transition-all duration-200 group-active:scale-95 ${
                cartActive
                  ? "bg-[#df6951]"
                  : "bg-[#004b79] group-hover:bg-[#00385b]"
              }`}
            >
              {cartActive ? (
                <HiShoppingBag className="h-7 w-7" />
              ) : (
                <HiOutlineShoppingBag className="h-7 w-7" />
              )}

              {hasHydrated && cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#df6951] px-1 text-[11px] font-bold text-white shadow-sm ring-2 ring-white">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </div>

            <span
              className={`mt-1 whitespace-nowrap text-[10px] font-bold tracking-tight ${
                cartActive ? "text-[#df6951]" : "text-gray-600"
              }`}
            >
              السلة
            </span>
          </Link>
        </div>

        {/* المنتجات وعنا */}
        <div className="flex flex-1 items-center justify-around">
          {navItems.slice(2, 4).map(renderNavItem)}
        </div>

      </div>
    </nav>
  );
}