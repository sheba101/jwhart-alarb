import { apiClient } from "@/lib/api-client";

import type {
  ProductVariant,
  ProductVariantAttribute,
  CreateProductVariantDto,
  UpdateProductVariantDto,
  CreateProductVariantAttributeDto,
  UpdateProductVariantAttributeDto,
} from "@/types/product-variant";

// تحويل بيانات الخيار إلى FormData
const createVariantFormData = (
  data: CreateProductVariantDto
): FormData => {
  const formData = new FormData();

  formData.append("productId", String(data.productId));
  formData.append("name", data.name);
  formData.append("image", data.image);

  if (data.price !== undefined) {
    formData.append("price", String(data.price));
  }

  formData.append("isAvailable", String(data.isAvailable ?? true));

  return formData;
};

// تحويل بيانات التعديل إلى FormData
const updateVariantFormData = (
  data: UpdateProductVariantDto
): FormData => {
  const formData = new FormData();

  if (data.name !== undefined) {
    formData.append("name", data.name);
  }

  if (data.image !== undefined) {
    formData.append("image", data.image);
  }

  if (data.price !== undefined) {
    formData.append("price", String(data.price ?? ""));
  }

  if (data.isAvailable !== undefined) {
    formData.append("isAvailable", String(data.isAvailable));
  }

  return formData;
};

export const productVariantService = {
  // جلب جميع الخيارات أو خيارات منتج معين
  getAll: async (productId?: number): Promise<ProductVariant[]> => {
    const url =
      productId !== undefined
        ? `/product-variants/product/${productId}`
        : "/product-variants";

    const response = await apiClient.get(url);
    return response.data;
  },

  // جلب خيار واحد
  getOne: async (id: number): Promise<ProductVariant> => {
    const response = await apiClient.get(`/product-variants/${id}`);
    return response.data;
  },

  // إنشاء خيار مع صورته
  create: async (
    data: CreateProductVariantDto
  ): Promise<ProductVariant> => {
    const formData = createVariantFormData(data);

    const response = await apiClient.post(
      "/product-variants",
      formData
    );

    return response.data;
  },

  // تعديل خيار، وإرسال الصورة فقط عند استبدالها
  update: async (
    id: number,
    data: UpdateProductVariantDto
  ): Promise<ProductVariant> => {
    const formData = updateVariantFormData(data);

    const response = await apiClient.patch(
      `/product-variants/${id}`,
      formData
    );

    return response.data;
  },

  // حذف خيار
  delete: async (id: number) => {
    const response = await apiClient.delete(`/product-variants/${id}`);
    return response.data;
  },

  // إضافة خاصية لخيار
  createAttribute: async (
    variantId: number,
    data: CreateProductVariantAttributeDto
  ): Promise<ProductVariantAttribute> => {
    const response = await apiClient.post(
      `/product-variants/${variantId}/attributes`,
      data
    );

    return response.data;
  },

  // تعديل خاصية
  updateAttribute: async (
    variantId: number,
    attributeId: number,
    data: UpdateProductVariantAttributeDto
  ): Promise<ProductVariantAttribute> => {
    const response = await apiClient.patch(
      `/product-variants/${variantId}/attributes/${attributeId}`,
      data
    );

    return response.data;
  },

  // حذف خاصية
  deleteAttribute: async (
    variantId: number,
    attributeId: number
  ) => {
    const response = await apiClient.delete(
      `/product-variants/${variantId}/attributes/${attributeId}`
    );

    return response.data;
  },
};