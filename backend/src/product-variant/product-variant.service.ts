import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { join, resolve, basename } from 'path';
import { mkdir, unlink } from 'fs/promises';
import { randomUUID } from 'crypto';
import sharp from 'sharp';

import { ProductVariantRepository } from './product-variant.repository';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto';
import { CreateProductVariantAttributeDto } from './dto/create-product-variant-attribute.dto';
import { UpdateProductVariantAttributeDto } from './dto/update-product-variant-attribute.dto';

@Injectable()
export class ProductVariantService {
  private readonly uploadDirectory = join(
    process.cwd(),
    'public',
    'uploads',
    'product-variants',
  );

  constructor(private readonly variantRepo: ProductVariantRepository) {}

  private async saveImage(file: Express.Multer.File): Promise<string> {
    try {
      await mkdir(this.uploadDirectory, { recursive: true });

      const filename = `${randomUUID()}.webp`;
      const fullPath = join(this.uploadDirectory, filename);

      await sharp(file.buffer).rotate().webp({ quality: 85 }).toFile(fullPath);

      return `/uploads/product-variants/${filename}`;
    } catch {
      throw new InternalServerErrorException('تعذر حفظ صورة الخيار');
    }
  }

  private async deleteImage(imagePath?: string | null): Promise<void> {
    if (!imagePath?.startsWith('/uploads/product-variants/')) {
      return;
    }

    const filename = basename(imagePath);
    const fullPath = resolve(this.uploadDirectory, filename);

    try {
      await unlink(fullPath);
    } catch {
      // لا نوقف العملية إذا كان الملف غير موجود.
    }
  }

  async create(data: CreateProductVariantDto, image?: Express.Multer.File) {
    const productExists = await this.variantRepo.productExists(data.productId);

    if (!productExists) {
      throw new NotFoundException(`المنتج رقم ${data.productId} غير موجود`);
    }

    const imagePath = image ? await this.saveImage(image) : null;

    try {
      return await this.variantRepo.create({
        name: data.name,
        image: imagePath,
        price: data.price,
        isAvailable: data.isAvailable ?? true,
        product: {
          connect: { id: data.productId },
        },
      });
    } catch (error) {
      await this.deleteImage(imagePath);
      throw error;
    }
  }

  async findAll(productId?: number) {
    if (productId !== undefined) {
      const productExists = await this.variantRepo.productExists(productId);

      if (!productExists) {
        throw new NotFoundException(`المنتج رقم ${productId} غير موجود`);
      }
    }

    return this.variantRepo.findAll(productId);
  }

  async findOne(id: number) {
    const variant = await this.variantRepo.findById(id);

    if (!variant) {
      throw new NotFoundException(`الخيار رقم ${id} غير موجود`);
    }

    return variant;
  }

  async update(
    id: number,
    data: UpdateProductVariantDto,
    image?: Express.Multer.File,
  ) {
    const currentVariant = await this.findOne(id);

    const newImagePath = image ? await this.saveImage(image) : undefined;

    try {
      const updatedVariant = await this.variantRepo.update(id, {
        ...data,
        ...(newImagePath ? { image: newImagePath } : {}),
      });

      if (newImagePath && currentVariant.image) {
        await this.deleteImage(currentVariant.image);
      }

      return updatedVariant;
    } catch (error) {
      if (newImagePath) {
        await this.deleteImage(newImagePath);
      }

      throw error;
    }
  }

  async remove(id: number) {
    const variant = await this.findOne(id);

    await this.variantRepo.delete(id);
    await this.deleteImage(variant.image);

    return { message: 'تم حذف الخيار بنجاح' };
  }

  async createAttribute(
    variantId: number,
    data: CreateProductVariantAttributeDto,
  ) {
    await this.findOne(variantId);

    return this.variantRepo.createAttribute(variantId, data);
  }

  async updateAttribute(
    variantId: number,
    attributeId: number,
    data: UpdateProductVariantAttributeDto,
  ) {
    await this.findOne(variantId);

    const attribute = await this.variantRepo.findAttribute(
      variantId,
      attributeId,
    );

    if (!attribute) {
      throw new NotFoundException(
        `الخاصية رقم ${attributeId} غير موجودة ضمن هذا الخيار`,
      );
    }

    return this.variantRepo.updateAttribute(attributeId, data);
  }

  async removeAttribute(variantId: number, attributeId: number) {
    await this.findOne(variantId);

    const attribute = await this.variantRepo.findAttribute(
      variantId,
      attributeId,
    );

    if (!attribute) {
      throw new NotFoundException(
        `الخاصية رقم ${attributeId} غير موجودة ضمن هذا الخيار`,
      );
    }

    await this.variantRepo.deleteAttribute(attributeId);

    return { message: 'تم حذف الخاصية بنجاح' };
  }
}
