"use client";

import { useQuery } from "@tanstack/react-query";
import { productVariantService } from "@/services/product-variant.service";

export const useProductVariants = (productId?: number) => {
  return useQuery({
    queryKey: ["product-variants", productId],
    queryFn: () => productVariantService.getAll(productId),
    enabled: Number.isInteger(productId) && Number(productId) > 0,
  });
};