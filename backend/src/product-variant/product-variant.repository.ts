import { Injectable } from '@nestjs/common';
import { Prisma, ProductVariant } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductVariantRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    data: Prisma.ProductVariantCreateInput,
  ): Promise<ProductVariant> {
    return this.prisma.productVariant.create({
      data,
      include: { attributes: true },
    });
  }

  async findAll(productId?: number) {
    return this.prisma.productVariant.findMany({
      where: productId === undefined ? {} : { productId },
      orderBy: { createdAt: 'desc' },
      include: { attributes: true },
    });
  }

  async findById(id: number) {
    return this.prisma.productVariant.findUnique({
      where: { id },
      include: { attributes: true },
    });
  }

  async update(
    id: number,
    data: Prisma.ProductVariantUpdateInput,
  ): Promise<ProductVariant> {
    return this.prisma.productVariant.update({
      where: { id },
      data,
      include: { attributes: true },
    });
  }

  async delete(id: number): Promise<ProductVariant> {
    return this.prisma.productVariant.delete({
      where: { id },
    });
  }

  async productExists(id: number): Promise<boolean> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      select: { id: true },
    });

    return product !== null;
  }

  async createAttribute(
    variantId: number,
    data: Prisma.ProductVariantAttributeCreateWithoutVariantInput,
  ) {
    return this.prisma.productVariantAttribute.create({
      data: {
        ...data,
        variant: { connect: { id: variantId } },
      },
    });
  }

  async findAttribute(variantId: number, attributeId: number) {
    return this.prisma.productVariantAttribute.findFirst({
      where: {
        id: attributeId,
        variantId,
      },
    });
  }

  async updateAttribute(
    attributeId: number,
    data: Prisma.ProductVariantAttributeUpdateInput,
  ) {
    return this.prisma.productVariantAttribute.update({
      where: { id: attributeId },
      data,
    });
  }

  async deleteAttribute(attributeId: number) {
    return this.prisma.productVariantAttribute.delete({
      where: { id: attributeId },
    });
  }
}
