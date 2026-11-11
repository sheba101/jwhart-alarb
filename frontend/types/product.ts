
export interface ProductCategory {
  id: number;
  name: string;
  description: string | null;
  image: string | null;
  isActive: boolean;
}

export interface ProductVariant {
  id: number;
  [key: string]: unknown;
}

export interface Product {
  id: number;
  categoryId: number;
  name: string;
  description: string | null;
  image: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;

  category?: ProductCategory;
  variants?: ProductVariant[];
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface GetProductsParams {
  page?: number;
  limit?: number;
  isActive?: boolean;
  search?: string;
  categoryId?: number;
  category?: string;
}
