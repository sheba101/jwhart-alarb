/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  HiOutlineEnvelope,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiOutlineArrowRight,
} from "react-icons/hi2";
import { FiLoader } from "react-icons/fi";
import { useLogin } from "@/hooks/auth/use-login";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  const loginMutation = useLogin();
  const isLoading = loginMutation.isPending;

  // حساب السنة بعد تحميل الصفحة لتجنب Blocking Route
  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    loginMutation.mutate(
      { email, password },
      {
        onSuccess: () => {
          router.replace("/dashboard/products");
        },
        onError: (error: any) => {
          const message =
            error.response?.data?.message ||
            "البريد الإلكتروني أو كلمة المرور غير صحيحة";

          setErrorMessage(
            Array.isArray(message) ? message.join("، ") : message
          );
        },
      }
    );
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#faf9f7] relative overflow-hidden px-4 py-8 select-none">

      {/* خلفية الصفحة */}
      <div className="absolute -top-32 right-[-10%] w-[380px] sm:w-[500px] h-[380px] sm:h-[500px] rounded-full bg-[#d6a87c]/15 blur-[100px] pointer-events-none" />

      <div className="absolute -bottom-32 left-[-10%] w-[380px] sm:w-[500px] h-[380px] sm:h-[500px] rounded-full bg-[#004b79]/10 blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">

        {/* العودة إلى الموقع */}
        <div className="mb-5 flex justify-start">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#004b79] transition-colors"
          >
            <HiOutlineArrowRight className="w-4 h-4" />
            <span>العودة إلى الموقع</span>
          </Link>
        </div>

        {/* بطاقة تسجيل الدخول */}
        <div className="w-full bg-white rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-[#e8d8c8]/60">

          {/* الشعار والعنوان */}
          <div className="flex flex-col items-center text-center mb-7">
            <div className="w-16 h-16 sm:w-20 sm:h-20 relative mb-3">
              <Image
                src="/imgs/logo.png"
                alt="جوهرة العرب"
                fill
                className="object-contain"
                priority
              />
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-[#004b79]">
              لوحة تحكم الإدارة
            </h2>

            <p className="text-xs sm:text-sm font-semibold text-gray-400 mt-1">
              سجّل الدخول للمتابعة إلى نظام جوهرة العرب
            </p>
          </div>

          {/* رسالة الخطأ */}
          {errorMessage && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-bold text-center">
              {errorMessage}
            </div>
          )}

          {/* نموذج تسجيل الدخول */}
          <form onSubmit={handleSubmit} className="space-y-4 text-right">

            {/* البريد الإلكتروني */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 mr-1">
                البريد الإلكتروني
              </label>

              <div className="relative flex items-center">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@johartalarab.com"
                  dir="ltr"
                  autoComplete="username"
                  className="w-full bg-[#faf9f7] border border-[#e8d8c8] focus:border-[#004b79] focus:bg-white text-gray-800 text-xs sm:text-sm rounded-2xl py-3 pl-3 pr-11 outline-none transition-all placeholder:text-gray-400 font-medium"
                />

                <HiOutlineEnvelope className="absolute right-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* كلمة المرور */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 mr-1">
                كلمة المرور
              </label>

              <div className="relative flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  dir="ltr"
                  autoComplete="current-password"
                  className="w-full bg-[#faf9f7] border border-[#e8d8c8] focus:border-[#004b79] focus:bg-white text-gray-800 text-xs sm:text-sm rounded-2xl py-3 pl-10 pr-11 outline-none transition-all placeholder:text-gray-400 font-medium"
                />

                <HiOutlineLockClosed className="absolute right-3.5 w-5 h-5 text-gray-400 pointer-events-none" />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3.5 text-gray-400 hover:text-[#004b79] transition-colors"
                  aria-label={
                    showPassword
                      ? "إخفاء كلمة المرور"
                      : "إظهار كلمة المرور"
                  }
                >
                  {showPassword ? (
                    <HiOutlineEyeSlash className="w-5 h-5" />
                  ) : (
                    <HiOutlineEye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* زر تسجيل الدخول */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-[#004b79] hover:bg-[#00385b] active:scale-[0.99] text-white font-bold text-sm rounded-2xl transition-all shadow-md shadow-[#004b79]/20 flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <FiLoader className="w-5 h-5 animate-spin" />
                    <span>جارٍ التحقق...</span>
                  </>
                ) : (
                  <span>تسجيل الدخول</span>
                )}
              </button>
            </div>
          </form>

          {/* التذييل */}
          <div className="mt-8 pt-4 border-t border-gray-100 text-center">
            <p className="text-[11px] text-gray-400 font-medium">
              متجر جوهرة العرب © {currentYear ?? ""} — نظام إدارة العمليات
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}