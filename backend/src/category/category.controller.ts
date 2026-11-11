import {
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
  BadRequestException,
  Query,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

import { diskStorage } from 'multer';

import { extname, join } from 'path';

import { existsSync, mkdirSync } from 'fs';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import sharp from 'sharp';

import { randomUUID } from 'crypto';

import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import type { Express } from 'express';

const uploadPath = join(process.cwd(), 'public', 'uploads', 'categories');

if (!existsSync(uploadPath)) {
  mkdirSync(uploadPath, {
    recursive: true,
  });
}

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // =========================================================
  // CREATE
  // =========================================================
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: uploadPath,

        filename: (req, file, callback) => {
          const extension = extname(file.originalname);

          const filename = `${randomUUID()}${extension}`;

          callback(null, filename);
        },
      }),

      limits: {
        fileSize: 5 * 1024 * 1024,
      },

      fileFilter: (req, file, callback) => {
        if (!file.mimetype.startsWith('image/')) {
          return callback(
            new BadRequestException('Only image files are allowed'),
            false,
          );
        }

        callback(null, true);
      },
    }),
  )
  async create(
    @Body() data: CreateCategoryDto,

    @UploadedFile()
    file?: Express.Multer.File,
  ) {
    let imagePath: string | undefined;

    if (file) {
      const outputFilename = `${randomUUID()}.webp`;

      const outputPath = join(uploadPath, outputFilename);
      await sharp(file.path)
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

      // حذف الملف الأصلي
      await this.deleteFile(file.path);

      imagePath = `/uploads/categories/${outputFilename}`;
    }

    return this.categoryService.create(data, imagePath);
  }

  // =========================================================
  // FIND ALL
  // =========================================================

  @Get()
  findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 10,
    @Query('isActive') isActive?: string,
    @Query('search') search?: string,
  ) {
    let activeFilter: boolean | undefined;

    if (isActive !== undefined) {
      activeFilter = isActive === 'true';
    }

    return this.categoryService.findAll(page, limit, activeFilter, search);
  }

  // =========================================================
  // FIND ONE
  // =========================================================

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.categoryService.findOne(id);
  }

  // =========================================================
  // UPDATE
  // =========================================================
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: uploadPath,

        filename: (req, file, callback) => {
          const extension = extname(file.originalname);

          const filename = `${randomUUID()}${extension}`;

          callback(null, filename);
        },
      }),

      limits: {
        fileSize: 5 * 1024 * 1024,
      },

      fileFilter: (req, file, callback) => {
        if (!file.mimetype.startsWith('image/')) {
          return callback(
            new BadRequestException('Only image files are allowed'),
            false,
          );
        }

        callback(null, true);
      },
    }),
  )
  async update(
    @Param('id', ParseIntPipe)
    id: number,

    @Body() data: UpdateCategoryDto,

    @UploadedFile()
    file?: Express.Multer.File,
  ) {
    const category = await this.categoryService.findOne(id);

    let imagePath: string | undefined;

    if (file) {
      const outputFilename = `${randomUUID()}.webp`;

      const outputPath = join(uploadPath, outputFilename);

      await sharp(file.path)
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

      // حذف الصورة المؤقتة
      await this.deleteFile(file.path);

      // حذف الصورة القديمة
      if (category.image) {
        await this.deleteImage(category.image);
      }

      imagePath = `/uploads/categories/${outputFilename}`;
    }

    return this.categoryService.update(id, data, imagePath);
  }

  // =========================================================
  // DELETE
  // =========================================================
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    const category = await this.categoryService.findOne(id);

    if (category.image) {
      await this.deleteImage(category.image);
    }

    return this.categoryService.remove(id);
  }

  // =========================================================
  // HELPERS
  // =========================================================

  private async deleteImage(imagePath: string) {
    const filename = imagePath.split('/').pop();

    if (!filename) {
      return;
    }

    const filePath = join(uploadPath, filename);

    await this.deleteFile(filePath);
  }

  private async deleteFile(filePath: string) {
    const fs = await import('fs/promises');

    try {
      await fs.unlink(filePath);
    } catch {
      // الملف غير موجود
    }
  }
}
