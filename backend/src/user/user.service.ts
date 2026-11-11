/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

type PublicUser = Omit<User, 'passwordHash'>;

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepository) {}

  private toPublicUser(user: User): PublicUser {
    const { passwordHash, ...result } = user;
    return result;
  }

  async create(data: CreateUserDto): Promise<PublicUser> {
    const existingUser = await this.userRepo.findUnique({
      email: data.email,
    });

    if (existingUser) {
      throw new ConflictException('البريد الإلكتروني مستخدم بالفعل');
    }

    const passwordHash = await bcrypt.hash(data.password, 12);

    const user = await this.userRepo.create({
      name: data.name,
      email: data.email,
      passwordHash,
      role: data.role ?? UserRole.ADMIN,
    });

    return this.toPublicUser(user);
  }

  async findAll(): Promise<PublicUser[]> {
    const users = await this.userRepo.findAll();

    return users.map((user) => this.toPublicUser(user));
  }

  async findOne(id: number): Promise<PublicUser> {
    const user = await this.userRepo.findUnique({ id });

    if (!user) {
      throw new NotFoundException(`المستخدم رقم ${id} غير موجود`);
    }

    return this.toPublicUser(user);
  }

  async update(id: number, data: UpdateUserDto): Promise<PublicUser> {
    const existingUser = await this.userRepo.findUnique({ id });

    if (!existingUser) {
      throw new NotFoundException(`المستخدم رقم ${id} غير موجود`);
    }

    if (data.email && data.email !== existingUser.email) {
      const emailOwner = await this.userRepo.findUnique({
        email: data.email,
      });

      if (emailOwner) {
        throw new ConflictException('البريد الإلكتروني مستخدم بالفعل');
      }
    }

    const updateData: {
      name?: string;
      email?: string;
      passwordHash?: string;
      role?: UserRole;
    } = {};

    if (data.name !== undefined) {
      updateData.name = data.name;
    }

    if (data.email !== undefined) {
      updateData.email = data.email;
    }

    if (data.password !== undefined) {
      updateData.passwordHash = await bcrypt.hash(data.password, 12);
    }

    if (data.role !== undefined) {
      updateData.role = data.role;
    }

    const user = await this.userRepo.update({ id }, updateData);

    return this.toPublicUser(user);
  }

  async remove(id: number): Promise<{ message: string }> {
    const existingUser = await this.userRepo.findUnique({ id });

    if (!existingUser) {
      throw new NotFoundException(`المستخدم رقم ${id} غير موجود`);
    }

    await this.userRepo.delete({ id });

    return { message: 'تم حذف المستخدم بنجاح' };
  }
}
