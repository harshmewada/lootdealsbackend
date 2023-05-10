import {
  ApiProperty,
  ApiPropertyOptional,
  IntersectionType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto, _IdDto } from 'src/commondto';

export class CreateProductDto {
  @IsOptional()
  @ApiProperty()
  productName: string;

  @IsOptional()
  @ApiProperty()
  amazonProductId: string;

  @IsOptional()
  @ApiProperty()
  productUrl: string;

  @IsString()
  @ApiProperty()
  description: string;

  @IsOptional()
  @ApiProperty()
  productImage?: string;

  @IsOptional()
  @ApiProperty()
  platformId: string;

  @IsOptional()
  @ApiProperty()
  categoryId: string;

  @IsOptional()
  @ApiProperty()
  basePrice: string;

  @IsOptional()
  @ApiProperty()
  salePrice: string;

  @IsOptional()
  @ApiProperty()
  discount: string;

  @IsOptional()
  @ApiPropertyOptional()
  isActive: boolean;

  @IsOptional()
  @ApiPropertyOptional()
  isExpired: boolean;

  @IsOptional()
  @ApiPropertyOptional()
  isAutoAdded: boolean;

  @IsOptional()
  @ApiPropertyOptional()
  isManyProducts: boolean;

  @IsOptional()
  @ApiPropertyOptional()
  createdBy: string;
}

export class UpdateProductDto extends IntersectionType(
  CreateProductDto,
  _IdDto,
) {}
export class ProductDto {
  @IsString()
  @ApiProperty()
  productName: string;

  @IsOptional()
  @ApiProperty()
  amazonProductId: string;

  @IsOptional()
  @ApiProperty()
  basePrice: string;

  @IsOptional()
  @ApiProperty()
  salePrice: string;

  @IsOptional()
  @ApiProperty()
  discount: string;

  @IsString()
  @ApiProperty()
  productUrl: string;

  @IsString()
  @ApiProperty()
  description: string;

  @IsString()
  @ApiProperty()
  productImage: string;

  @IsOptional()
  @ApiProperty()
  platformId: string;

  @IsOptional()
  @ApiProperty()
  categoryId: string;

  @IsOptional()
  @ApiPropertyOptional()
  isActive: boolean;

  @IsOptional()
  @ApiPropertyOptional()
  isManyProducts: boolean;

  @IsOptional()
  @ApiPropertyOptional()
  isExpired: boolean;

  @IsOptional()
  @ApiPropertyOptional()
  isAutoAdded: boolean;

  @IsString()
  @ApiPropertyOptional()
  createdBy: string;
}

export class ProductQueryDto extends IntersectionType(
  PaginationQueryDto,
  PartialType(UpdateProductDto),
) {}
