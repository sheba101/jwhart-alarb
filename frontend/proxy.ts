import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;

  const { pathname } = request.nextUrl;

  const isDashboard = pathname.startsWith("/dashboard");
  const isLoginPage = pathname === "/admin/login";

  // لا تسمح بدخول لوحة التحكم بدون توكن
  if (isDashboard && !token) {
    return NextResponse.redirect(
      new URL("/admin/login", request.url)
    );
  }

  // إذا كان لديه توكن، لا تعرض له صفحة تسجيل الدخول
  if (isLoginPage && token) {
    return NextResponse.redirect(
      new URL("/dashboard", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/login"],
};