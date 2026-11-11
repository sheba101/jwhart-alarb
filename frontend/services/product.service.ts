import { apiClient } from "@/lib/api-client";
import type {
  Product,
  GetProductsParams,
  PaginatedResponse,
} from "@/types/product";

export interface CreateProductDto {
  categoryId: number;
  name: string;
  description?: string;
  isActive?: boolean;
  image?: File;
}

export interface UpdateProductDto {
  categoryId?: number;
  name?: string;
  description?: string;
  isActive?: boolean;
  image?: File;
}

const buildFormData = (
  data: CreateProductDto | UpdateProductDto
): FormData => {
  const formData = new FormData();

  if (data.categoryId !== undefined) {
    formData.append("categoryId", String(data.categoryId));
  }

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

export const productService = {
  getAll: async (
    params?: GetProductsParams
  ): Promise<PaginatedResponse<Product>> => {
    const response = await apiClient.get("/products", {
      params,
    });

    return response.data;
  },

  getOne: async (id: number): Promise<Product> => {
    const response = await apiClient.get(`/products/${id}`);

    return response.data;
  },

  create: async (data: CreateProductDto): Promise<Product> => {
    console.log("Creating product with data:", data);
    const response = await apiClient.post(
      "/products",
      buildFormData(data)
    );

    return response.data;
  },

  update: async (
    id: number,
    data: UpdateProductDto
  ): Promise<Product> => {
    console.log("Updating product with ID:", id, "and data:", data);
    const response = await apiClient.patch(
      `/products/${id}`,
      buildFormData(data)
    );

    return response.data;
  },

  delete: async (id: number): Promise<Product> => {
    const response = await apiClient.delete(`/products/${id}`);

    return response.data;
  },

  getSuggestions: async (
  search: string
): Promise<{ id: number; name: string }[]> => {
  const response = await apiClient.get("/products/suggestions", {
    params: { search },
  });

  return response.data;
},
};