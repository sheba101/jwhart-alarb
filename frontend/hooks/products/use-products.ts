"use client";

import { useQuery } from "@tanstack/react-query";
import { productService } from "@/services/product.service";
import type { GetProductsParams } from "@/types/product";

export const useProducts = (params?: GetProductsParams) => {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => productService.getAll(params),
  });
};


export const useProduct = (id: number) => {
  return useQuery({
    queryKey: ["products", id],
    queryFn: () => productService.getOne(id),
    enabled: Number.isInteger(id) && id > 0,
  });
};
