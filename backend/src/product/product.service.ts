import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { ProductRepository } from './product.repository';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async create(data: CreateProductDto, image?: string) {
    const categoryExists = await this.productRepository.categoryExists(
      data.categoryId,
    );

    if (!categoryExists) {
      throw new BadRequestException('Category does not exist');
    }

    return this.productRepository.create({
      name: data.name,
      categoryId: data.categoryId,
      description: data.description,
      image,
      isActive: data.isActive ?? true,
    });
  }

  async findAll(
    page = 1,
    limit = 10,
    isActive?: boolean,
    search?: string,
    categoryId?: number,
    category?: string,
  ) {
    return this.productRepository.findAll({
      page,
      limit,
      isActive,
      search,
      categoryId,
      category,
    });
  }

  async findOne(id: number) {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async update(id: number, data: UpdateProductDto, image?: string) {
    await this.findOne(id);

    if (data.categoryId !== undefined) {
      const categoryExists = await this.productRepository.categoryExists(
        data.categoryId,
      );

      if (!categoryExists) {
        throw new BadRequestException('Category does not exist');
      }
    }

    return this.productRepository.update(id, {
      ...data,
      ...(image !== undefined && { image }),
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.productRepository.delete(id);
  }

  async findSuggestions(search?: string) {
    const query = search?.trim();

    if (!query || query.length < 2) {
      return [];
    }

    return this.productRepository.findSuggestions(query);
  }
}
