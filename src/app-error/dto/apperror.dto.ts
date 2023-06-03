import {
  ApiProperty,
  ApiPropertyOptional,
  IntersectionType,
  PickType,
} from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto, _IdDto } from 'src/commondto';

export class CreateAppErrorDto {
  @IsOptional()
  @ApiProperty()
  error: string;
}

export class AppErrorDto {
  @IsString()
  @ApiProperty()
  error: string;

  @IsString()
  @ApiPropertyOptional()
  message: string;

  @IsString()
  @ApiPropertyOptional()
  errorName: string;
  @IsString()
  @ApiPropertyOptional()
  brand: string;
  @IsString()
  @ApiPropertyOptional()
  buildNumber: string;
  @IsString()
  @ApiPropertyOptional()
  device: string;

  @IsString()
  @ApiPropertyOptional()
  deviceName: string;

  @IsString()
  @ApiPropertyOptional()
  os: string;
}

export class AppErrorQueryDto extends IntersectionType(
  PaginationQueryDto,
  // PickType(AppErrorDto, ['categoryName'] as const),
) {}
