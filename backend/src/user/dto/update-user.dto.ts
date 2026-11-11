/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from '@prisma/client';

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: 'الاسم يجب أن يكون نصاً' })
  @IsNotEmpty({ message: 'الاسم لا يمكن أن يكون فارغاً' })
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: 'صيغة البريد الإلكتروني غير صحيحة' })
  @IsNotEmpty({ message: 'البريد الإلكتروني لا يمكن أن يكون فارغاً' })
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6, {
    message: 'يجب ألا تقل كلمة المرور عن 6 خانات',
  })
  password?: string;

  @IsOptional()
  @IsEnum(UserRole, { message: 'نوع الدور غير صالح' })
  role?: UserRole;
}
