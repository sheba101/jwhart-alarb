// api-client.ts
import axios from "axios";

export const apiClient = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:3005/api",

  timeout: 15000,

  headers: {
    Accept: "application/json",
  },
});

// إضافة JWT ومعالجة نوع البيانات تلقائياً
apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  // إذا كانت البيانات المرسلة FormData، احذف Content-Type ليدعه المتصفح يولد الـ boundary الصحيح
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  } else if (!config.headers["Content-Type"]) {
    config.headers["Content-Type"] = "application/json";
  }

  return config;
});

// معالجة الاستجابات والأخطاء
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");

        document.cookie =
          "access_token=; Path=/; Max-Age=0; SameSite=Lax";

        if (window.location.pathname !== "/admin/login") {
          window.location.href = "/admin/login";
        }
      }
    }

    return Promise.reject(error);
  }
);