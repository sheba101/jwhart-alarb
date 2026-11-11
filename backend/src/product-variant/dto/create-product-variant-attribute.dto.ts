import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateProductVariantAttributeDto {
  @IsString()
  @IsNotEmpty({ message: 'اسم الخاصية مطلوب' })
  @MaxLength(100)
  name!: string;

  @IsString()
  @IsNotEmpty({ message: 'قيمة الخاصية مطلوبة' })
  @MaxLength(255)
  value!: string;
}
