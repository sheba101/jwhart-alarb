import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Query,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join, resolve, sep } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { randomUUID } from 'crypto';
import { unlink } from 'fs/promises';
import sharp from 'sharp';
import type { Express } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

const uploadPath = join(process.cwd(), 'public', 'uploads', 'products');

if (!existsSync(uploadPath)) {
  mkdirSync(uploadPath, { recursive: true });
}

const imageInterceptor = FileInterceptor('image', {
  storage: diskStorage({
    destination: uploadPath,
    filename: (_req, file, callback) => {
      callback(null, `${randomUUID()}${extname(file.originalname)}`);
    },
  }),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (_req, file, callback) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

    if (!allowed.includes(file.mimetype)) {
      return callback(
        new BadRequestException(
          'Only JPEG, PNG, WebP and AVIF images are allowed',
        ),
        false,
      );
    }

    callback(null, true);
  },
});

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(imageInterceptor)
  async create(
    @Body() data: CreateProductDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    let imagePath: string | undefined;
    let outputPath: string | undefined;

    try {
      if (file) {
        const filename = `${randomUUID()}.webp`;
        outputPath = join(uploadPath, filename);

        await sharp(file.path, {
          limitInputPixels: 40_000_000,
        })
          .rotate()
          .resize({
            width: 2000,
            height: 2000,
            fit: 'inside',
            withoutEnlargement: true,
          })
          .webp({
            quality: 90,
            effort: 4,
          })
          .toFile(outputPath);

        imagePath = `/uploads/products/${filename}`;
      }

      return await this.productService.create(data, imagePath);
    } catch (error) {
      if (outputPath) {
        await this.deleteFile(outputPath);
      }
      throw error;
    } finally {
      if (file) {
        await this.deleteFile(file.path);
      }
    }
  }

  @Get()
  findAll(
    @Query('page', new ParseIntPipe({ optional: true }))
    page = 1,

    @Query('limit', new ParseIntPipe({ optional: true }))
    limit = 10,

    @Query('isActive') isActive?: string,

    @Query('search') search?: string,

    @Query('categoryId', new ParseIntPipe({ optional: true }))
    categoryId?: number,

    @Query('category') category?: string,
  ) {
    let activeFilter: boolean | undefined;

    if (isActive !== undefined) {
      activeFilter = isActive === 'true';
    }

    return this.productService.findAll(
      page,
      limit,
      activeFilter,
      search,
      categoryId,
      category,
    );
  }

  @Get('suggestions')
  findSuggestions(@Query('search') search?: string) {
    return this.productService.findSuggestions(search);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UseInterceptors(imageInterceptor)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateProductDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    let newImagePath: string | undefined;
    let outputPath: string | undefined;

    try {
      const product = await this.productService.findOne(id);

      if (file) {
        const filename = `${randomUUID()}.webp`;
        outputPath = join(uploadPath, filename);

        await sharp(file.path, {
          limitInputPixels: 40_000_000,
        })
          .rotate()
          .resize({
            width: 2000,
            height: 2000,
            fit: 'inside',
            withoutEnlargement: true,
          })
          .webp({
            quality: 90,
            effort: 4,
          })
          .toFile(outputPath);

        newImagePath = `/uploads/products/${filename}`;
      }

      const updated = await this.productService.update(id, data, newImagePath);

      // نحذف القديمة بعد نجاح تحديث قاعدة البيانات.
      if (file && product.image) {
        await this.deleteImage(product.image);
      }

      return updated;
    } catch (error) {
      if (outputPath) {
        await this.deleteFile(outputPath);
      }
      throw error;
    } finally {
      if (file) {
        await this.deleteFile(file.path);
      }
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const product = await this.productService.findOne(id);

    const deleted = await this.productService.remove(id);

    if (product.image) {
      await this.deleteImage(product.image);
    }

    return deleted;
  }

  private async deleteImage(imagePath: string) {
    const filename = imagePath.split('/').pop();

    if (!filename) return;

    const filePath = resolve(uploadPath, filename);

    // منع الوصول إلى مسارات خارج مجلد الصور.
    if (!filePath.startsWith(`${resolve(uploadPath)}${sep}`)) {
      return;
    }

    await this.deleteFile(filePath);
  }

  private async deleteFile(filePath: string) {
    try {
      await unlink(filePath);
    } catch {
      // لا يوجد ملف للحذف.
    }
  }
}
