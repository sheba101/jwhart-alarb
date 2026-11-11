"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  HiOutlineCube,
  HiOutlineSquares2X2,
  HiOutlineBars3,
  HiOutlineXMark,
  HiOutlineArrowRightOnRectangle,
  HiOutlineBell,
  HiOutlineShieldCheck,
  HiOutlineArrowTopRightOnSquare,
} from "react-icons/hi2";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  {
    name: "المنتجات",
    href: "/dashboard/products",
    icon: HiOutlineCube,
    exact: true,
  },
  {
    name: "الأصناف",
    href: "/dashboard/categories",
    icon: HiOutlineSquares2X2,
  },
];

function AdminLayoutContent({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // إغلاق القائمة عند الانتقال إلى صفحة أخرى
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // إخفاء القائمة في صفحة تسجيل الدخول
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = () => {
    localStorage.removeItem("access_token");

    document.cookie =
      "access_token=; Path=/; Max-Age=0; SameSite=Lax";

    router.replace("/admin/login");
    router.refresh();
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#f7f8fa] text-gray-800"
    >
      {/* Mobile overlay */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="إغلاق القائمة"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px] lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 right-0 z-50
          flex w-[270px] flex-col
          border-l border-gray-200 bg-white
          transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${
            sidebarOpen
              ? "translate-x-0"
              : "translate-x-full"
          }
        `}
      >
        {/* Brand */}
        <div className="flex h-[76px] shrink-0 items-center justify-between border-b border-gray-100 px-5">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#004b79] text-white">
              <HiOutlineShieldCheck className="h-6 w-6" />
            </div>

            <div>
              <h2 className="text-sm font-black text-gray-900">
                جوهرة العرب
              </h2>
              <p className="mt-0.5 text-[11px] text-gray-400">
                لوحة الإدارة
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 lg:hidden"
            aria-label="إغلاق القائمة"
          >
            <HiOutlineXMark className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-6">
          <p className="mb-3 px-3 text-[10px] font-bold tracking-wider text-gray-400">
            القائمة الرئيسية
          </p>

          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);

              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 rounded-xl px-3 py-3
                    text-[13px] font-semibold transition-all duration-200
                    ${
                      isActive
                        ? "bg-[#004b79]/[0.08] text-[#004b79]"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                    }
                  `}
                >
                  <Icon
                    className={`h-[19px] w-[19px] shrink-0 ${
                      isActive
                        ? "text-[#004b79]"
                        : "text-gray-400"
                    }`}
                  />

                  <span>{item.name}</span>

                  {isActive && (
                    <span className="mr-auto h-1.5 w-1.5 rounded-full bg-[#004b79]" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar footer */}
        <div className="shrink-0 border-t border-gray-100 p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-gray-500 transition hover:bg-red-50 hover:text-red-600"
          >
            <HiOutlineArrowRightOnRectangle className="h-5 w-5" />
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="min-h-screen min-w-0 lg:mr-[270px]">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-[68px] items-center justify-between border-b border-gray-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl p-2 text-gray-600 transition hover:bg-gray-100 lg:hidden"
              aria-label="فتح القائمة"
            >
              <HiOutlineBars3 className="h-6 w-6" />
            </button>

            <div className="min-w-0">
              <h1 className="truncate text-sm font-bold text-gray-800 sm:text-base">
                لوحة الإدارة
              </h1>
              <p className="hidden text-[11px] text-gray-400 sm:block">
                إدارة المتجر ومحتوياته
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <button
              type="button"
              title="الإشعارات"
              aria-label="الإشعارات"
              className="relative rounded-xl p-2.5 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
            >
              <HiOutlineBell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#df6951]" />
            </button>

            <div className="hidden h-7 w-px bg-gray-200 sm:block" />

            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 rounded-xl bg-gray-50 px-3 py-2.5 text-[11px] font-semibold text-gray-600 transition hover:bg-gray-100 hover:text-[#004b79] sm:text-xs"
            >
              <span>زيارة المتجر</span>
              <HiOutlineArrowTopRightOnSquare className="h-4 w-4" />
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="w-full p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-[1440px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#f7f8fa]">
          <p className="text-sm font-semibold text-gray-500">
            جاري التحميل...
          </p>
        </div>
      }
    >
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </Suspense>
  );
}