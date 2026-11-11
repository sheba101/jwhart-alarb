"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { productVariantService } from "@/services/product-variant.service";

import type {
  CreateProductVariantDto,
  UpdateProductVariantDto,
  CreateProductVariantAttributeDto,
  UpdateProductVariantAttributeDto,
} from "@/types/product-variant";

// =========================
// Cache Helpers
// =========================

const invalidateVariantQueries = async (
  queryClient: ReturnType<typeof useQueryClient>,
  productId?: number,
  variantId?: number
) => {
  const tasks = [
    queryClient.invalidateQueries({
      queryKey: ["product-variants"],
    }),
  ];

  if (productId !== undefined) {
    tasks.push(
      queryClient.invalidateQueries({
        queryKey: ["products", productId],
      })
    );

    tasks.push(
      queryClient.invalidateQueries({
        queryKey: ["products"],
      })
    );
  }

  if (variantId !== undefined) {
    tasks.push(
      queryClient.invalidateQueries({
        queryKey: ["product-variants", "detail", variantId],
      })
    );
  }

  await Promise.all(tasks);
};

// =========================
// Create Variant
// =========================

export const useCreateProductVariant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductVariantDto) =>
      productVariantService.create(data),

    onSuccess: async (_, variables) => {
      await invalidateVariantQueries(
        queryClient,
        variables.productId
      );
    },
  });
};

// =========================
// Update Variant
// =========================

export const useUpdateProductVariant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: UpdateProductVariantDto;
      productId?: number;
    }) => productVariantService.update(id, data),

    onSuccess: async (_, variables) => {
      await invalidateVariantQueries(
        queryClient,
        variables.productId,
        variables.id
      );
    },
  });
};

// =========================
// Delete Variant
// =========================

export const useDeleteProductVariant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
    }: {
      id: number;
      productId?: number;
    }) => productVariantService.delete(id),

    onSuccess: async (_, variables) => {
      await invalidateVariantQueries(
        queryClient,
        variables.productId,
        variables.id
      );

      queryClient.removeQueries({
        queryKey: ["product-variants", "detail", variables.id],
      });
    },
  });
};

// =========================
// Create Attribute
// =========================

export const useCreateVariantAttribute = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      variantId,
      data,
    }: {
      variantId: number;
      productId?: number;
      data: CreateProductVariantAttributeDto;
    }) =>
      productVariantService.createAttribute(variantId, data),

    onSuccess: async (_, variables) => {
      await invalidateVariantQueries(
        queryClient,
        variables.productId,
        variables.variantId
      );
    },
  });
};

// =========================
// Update Attribute
// =========================

export const useUpdateVariantAttribute = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      variantId,
      attributeId,
      data,
    }: {
      variantId: number;
      attributeId: number;
      productId?: number;
      data: UpdateProductVariantAttributeDto;
    }) =>
      productVariantService.updateAttribute(
        variantId,
        attributeId,
        data
      ),

    onSuccess: async (_, variables) => {
      await invalidateVariantQueries(
        queryClient,
        variables.productId,
        variables.variantId
      );
    },
  });
};

// =========================
// Delete Attribute
// =========================

export const useDeleteVariantAttribute = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      variantId,
      attributeId,
    }: {
      variantId: number;
      attributeId: number;
      productId?: number;
    }) =>
      productVariantService.deleteAttribute(
        variantId,
        attributeId
      ),

    onSuccess: async (_, variables) => {
      await invalidateVariantQueries(
        queryClient,
        variables.productId,
        variables.variantId
      );
    },
  });
};