import {
  ApiProperty,
  ApiPropertyOptional,
  IntersectionType,
  PickType,
} from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto, _IdDto } from 'src/commondto';

export class CreateCategoryDto {
  @IsOptional()
  @ApiProperty()
  categoryName: string;

  @IsOptional()
  @ApiPropertyOptional()
  enableNotification: boolean;

  @IsOptional()
  @ApiProperty()
  categoryImage?: string;

  @IsOptional()
  @ApiPropertyOptional()
  isActive: boolean;

  @IsOptional()
  @ApiPropertyOptional()
  showInHomepage: boolean;

  @IsOptional()
  @ApiPropertyOptional()
  createdBy: string;
}

export class UpdateCategoryDto extends IntersectionType(
  CreateCategoryDto,
  _IdDto,
) {}
export class CategoryDto {
  @IsString()
  @ApiProperty()
  categoryName: string;

  @IsOptional()
  @ApiProperty()
  categoryImage: string;

  @IsString()
  @ApiProperty()
  enableNotification: boolean;

  @IsOptional()
  @ApiPropertyOptional()
  isActive: boolean;

  @IsOptional()
  @ApiPropertyOptional()
  showInHomepage: boolean;

  @IsString()
  @ApiPropertyOptional()
  createdBy: string;
}

export class CategoryQueryDto extends IntersectionType(
  PaginationQueryDto,
  PickType(UpdateCategoryDto, ['categoryName'] as const),
) {}
