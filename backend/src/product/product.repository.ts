import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, Product } from '@prisma/client';

export interface FindProductsParams {
  page: number;
  limit: number;
  isActive?: boolean;
  search?: string;
  categoryId?: number;
  category?: string;
}

@Injectable()
export class ProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.ProductUncheckedCreateInput): Promise<Product> {
    return this.prisma.product.create({
      data,
    });
  }

  async findAll(params: FindProductsParams) {
    const { page, limit, isActive, search, categoryId, category } = params;

    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      // فلترة حسب الحالة
      ...(isActive !== undefined && {
        isActive,
      }),

      // البحث في اسم المنتج والوصف
      ...(search && {
        OR: [
          {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ],
      }),

      // البحث بواسطة categoryId
      ...(categoryId !== undefined && {
        categoryId,
      }),

      // البحث باسم التصنيف
      ...(category && {
        category: {
          name: {
            contains: category,
            mode: 'insensitive',
          },
        },
      }),
    };

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          category: true,
          variants: true,
        },
      }),

      this.prisma.product.count({
        where,
      }),
    ]);

    return {
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: number): Promise<Product | null> {
    return this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        variants: true,
      },
    });
  }

  async update(
    id: number,
    data: Prisma.ProductUncheckedUpdateInput,
  ): Promise<Product> {
    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<Product> {
    return this.prisma.product.delete({
      where: { id },
    });
  }

  async categoryExists(categoryId: number): Promise<boolean> {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
      select: { id: true },
    });

    return category !== null;
  }

  async findSuggestions(search: string) {
    return this.prisma.product.findMany({
      where: {
        isActive: true,
        name: {
          contains: search,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        name: true,
      },
      take: 3,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
