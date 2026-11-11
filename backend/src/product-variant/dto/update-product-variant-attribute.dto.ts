import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateProductVariantAttributeDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  value?: string;
}
