
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3005/api";

const SERVER_URL = API_URL.replace(/\/api\/?$/, "");

export const getImageUrl = (path?: string | null): string => {
  if (!path) return "/imgs/category-placeholder.png";

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return `${SERVER_URL}${path.startsWith("/") ? path : `/${path}`}`;
};
