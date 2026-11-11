"use client";

import { useMutation } from "@tanstack/react-query";
import { authService, LoginDto } from "@/services/auth.service";

export const useLogin = () => {
  return useMutation({
    mutationFn: (data: LoginDto) => authService.login(data),

    onSuccess: (data) => {
      const token = data.access_token;

      // لاستخدام التوكن في طلبات Axios
      localStorage.setItem("access_token", token);

      // ليتمكن Next.js Proxy من قراءة حالة تسجيل الدخول
      const secure =
        process.env.NODE_ENV === "production" ? "; Secure" : "";

      document.cookie = `access_token=${encodeURIComponent(
        token
      )}; Path=/; Max-Age=3600; SameSite=Lax${secure}`;
    },
  });
};