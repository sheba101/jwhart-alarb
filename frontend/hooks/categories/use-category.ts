"use client";

import { useQuery } from "@tanstack/react-query";
import { categoryService } from "@/services/category.service";

export const useCategory = (id: number) => {
  return useQuery({
    queryKey: ["categories", id],
    queryFn: () => categoryService.getOne(id),
    enabled: Number.isInteger(id) && id > 0,
  });
};