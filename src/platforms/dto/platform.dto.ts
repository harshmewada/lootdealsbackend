import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreatePlatformDto {
  @IsString()
  @ApiProperty()
  platformName: string;

  @IsOptional()
  @ApiProperty({ type: String, format: 'binary' })
  platformImage?: { type: string; format: 'binary' };

  @IsOptional()
  @ApiPropertyOptional()
  isActive: boolean;

  @IsOptional()
  @ApiPropertyOptional()
  createdBy: string;
}

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
