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
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { ProductVariantService } from './product-variant.service';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto';
import { CreateProductVariantAttributeDto } from './dto/create-product-variant-attribute.dto';
import { UpdateProductVariantAttributeDto } from './dto/update-product-variant-attribute.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';

@Controller('product-variants')
export class ProductVariantController {
  constructor(private readonly variantService: ProductVariantService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      limits: { fileSize: 10 * 1024 * 1024 },
      fileFilter: (_req, file, callback) => {
        const allowedTypes = [
          'image/jpeg',
          'image/png',
          'image/webp',
          'image/avif',
        ];

        if (!allowedTypes.includes(file.mimetype)) {
          return callback(
            new BadRequestException(
              'نوع الصورة غير مدعوم. استخدم JPEG أو PNG أو WebP أو AVIF',
            ),
            false,
          );
        }

        callback(null, true);
      },
    }),
  )
  create(
    @Body() data: CreateProductVariantDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.variantService.create(data, image);
  }

  @Get()
  findAll() {
    return this.variantService.findAll();
  }

  @Get('product/:productId')
  findByProduct(@Param('productId', ParseIntPipe) productId: number) {
    return this.variantService.findAll(productId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.variantService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      limits: { fileSize: 10 * 1024 * 1024 },
      fileFilter: (_req, file, callback) => {
        const allowedTypes = [
          'image/jpeg',
          'image/png',
          'image/webp',
          'image/avif',
        ];

        if (!allowedTypes.includes(file.mimetype)) {
          return callback(
            new BadRequestException(
              'نوع الصورة غير مدعوم. استخدم JPEG أو PNG أو WebP أو AVIF',
            ),
            false,
          );
        }

        callback(null, true);
      },
    }),
  )
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateProductVariantDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.variantService.update(id, data, image);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.variantService.remove(id);
  }

  @Post(':id/attributes')
  @UseGuards(JwtAuthGuard)
  createAttribute(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: CreateProductVariantAttributeDto,
  ) {
    return this.variantService.createAttribute(id, data);
  }

  @Patch(':id/attributes/:attributeId')
  @UseGuards(JwtAuthGuard)
  updateAttribute(
    @Param('id', ParseIntPipe) id: number,
    @Param('attributeId', ParseIntPipe) attributeId: number,
    @Body() data: UpdateProductVariantAttributeDto,
  ) {
    return this.variantService.updateAttribute(id, attributeId, data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/attributes/:attributeId')
  removeAttribute(
    @Param('id', ParseIntPipe) id: number,
    @Param('attributeId', ParseIntPipe) attributeId: number,
  ) {
    return this.variantService.removeAttribute(id, attributeId);
  }
}
