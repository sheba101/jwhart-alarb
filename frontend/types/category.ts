
export interface Category {
  id: number;
  name: string;
  description: string | null;
  image: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
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

export interface GetCategoriesParams {
  page?: number;
  limit?: number;
  isActive?: boolean;
  search?: string;
}
