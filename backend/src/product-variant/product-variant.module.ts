import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { ProductVariantController } from './product-variant.controller';
import { ProductVariantService } from './product-variant.service';
import { ProductVariantRepository } from './product-variant.repository';

@Module({
  imports: [PrismaModule],
  controllers: [ProductVariantController],
  providers: [ProductVariantService, ProductVariantRepository],
  exports: [ProductVariantService],
})
export class ProductVariantModule {}
