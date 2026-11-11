"use client";

import { useQuery } from "@tanstack/react-query";

import { productVariantService } from "@/services/product-variant.service";

export const useProductVariant = (id: number) => {
  return useQuery({
    queryKey: ["product-variants", "detail", id],
    queryFn: () => productVariantService.getOne(id),
    enabled: Number.isInteger(id) && id > 0,
  });
};