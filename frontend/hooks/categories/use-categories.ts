"use client";

import { useQuery } from "@tanstack/react-query";
import { categoryService } from "@/services/category.service";
import { GetCategoriesParams } from "@/types/category";

export const useCategories = (params?: GetCategoriesParams) => {
  return useQuery({
    queryKey: ["categories", params],
    queryFn: () => categoryService.getAll(params),
  });
};