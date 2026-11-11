/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CategoryRepository } from './category.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async create(data: CreateCategoryDto, image?: string) {
    return this.categoryRepository.create({
      name: data.name,
      description: data.description,
      image,
      isActive: data.isActive ?? true,
    });
  }

  async findAll(page = 1, limit = 10, isActive?: boolean, search?: string) {
    return this.categoryRepository.findAll({
      page,
      limit,
      isActive,
      search,
    });
  }
  async findOne(id: number) {
    const category = await this.categoryRepository.findById(id);

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async update(id: number, data: UpdateCategoryDto, image?: string) {
    const category = await this.findOne(id);

    return this.categoryRepository.update(id, {
      ...data,
      ...(image !== undefined && {
        image,
      }),
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.categoryRepository.delete(id);
  }
}
