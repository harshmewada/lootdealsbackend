import {
  ApiProperty,
  ApiPropertyOptional,
  IntersectionType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto, _IdDto } from 'src/commondto';

export class CreatePlatformDto {
  @IsOptional()
  @ApiProperty()
  platformName: string;

  @IsOptional()
  @ApiProperty()
  platformImage?: string;

  @IsOptional()
  @ApiPropertyOptional()
  isActive: boolean;

  @IsOptional()
  @ApiPropertyOptional()
  createdBy: string;
}

export class UpdatePlatformDto extends IntersectionType(
  CreatePlatformDto,
  _IdDto,
) {}
export class PlatformDto {
  @IsString()
  @ApiProperty()
  platformName: string;

  @IsString()
  @ApiProperty()
  platformImage: string;

  @IsOptional()
  @ApiPropertyOptional()
  isActive: boolean;

  @IsString()
  @ApiPropertyOptional()
  createdBy: string;
}

export class PlatformQueryDto extends IntersectionType(
  PaginationQueryDto,
  PartialType(UpdatePlatformDto),
) {}
