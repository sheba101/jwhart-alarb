import { apiClient } from "@/lib/api-client";
import {
  Category,
  GetCategoriesParams,
  PaginatedResponse,
} from "@/types/category";

export interface CreateCategoryDto {
  name: string;
  description?: string;
  isActive?: boolean;
  image?: File;
}

export interface UpdateCategoryDto {
  name?: string;
  description?: string;
  isActive?: boolean;
  image?: File;
}

const buildFormData = (
  data: CreateCategoryDto | UpdateCategoryDto
) => {
  const formData = new FormData();

  if (data.name !== undefined) {
    formData.append("name", data.name);
  }

  if (data.description !== undefined) {
    formData.append("description", data.description);
  }

  if (data.isActive !== undefined) {
    formData.append("isActive", String(data.isActive));
  }

  if (data.image) {
    formData.append("image", data.image);
  }

  return formData;
};

export const categoryService = {
  // جلب جميع التصنيفات مع البحث والفلترة والصفحات
  getAll: async (
    params?: GetCategoriesParams
  ): Promise<PaginatedResponse<Category>> => {
    const response = await apiClient.get("/categories", {
      params,
    });

    return response.data;
  },

  // جلب تصنيف واحد
  getOne: async (id: number): Promise<Category> => {
    const response = await apiClient.get(`/categories/${id}`);
    return response.data;
  },

  // إنشاء تصنيف
  create: async (data: CreateCategoryDto) => {
    const response = await apiClient.post(
      "/categories",
      buildFormData(data)
    );

    return response.data;
  },

  // تعديل تصنيف
  update: async (id: number, data: any) => {
    console.log(data)
    const response = await apiClient.patch(
      `/categories/${id}`,
      buildFormData(data)
    );

    return response.data;
  },

  // حذف تصنيف
  delete: async (id: number) => {
    const response = await apiClient.delete(`/categories/${id}`);
    return response.data;
  },
};