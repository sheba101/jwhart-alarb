export interface ProductVariantAttribute {
  id: number;
  variantId: number;
  name: string;
  value: string;
}

export interface ProductVariant {
  id: number;
  productId: number;
  name: string;
  image: string | null;
  price: number | string | null;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
  attributes: ProductVariantAttribute[];
}

// جلب الخيارات
export interface GetProductVariantsParams {
  productId?: number;
}

export interface CreateProductVariantDto {
  productId: number;
  name: string;
  image: File;
  price?: number;
  isAvailable?: boolean;
}

export interface UpdateProductVariantDto {
  name?: string;
  image?: File;
  price?: number | null;
  isAvailable?: boolean;
}

// إنشاء خاصية
export interface CreateProductVariantAttributeDto {
  name: string;
  value: string;
}

// تعديل خاصية
export interface UpdateProductVariantAttributeDto {
  name?: string;
  value?: string;
}