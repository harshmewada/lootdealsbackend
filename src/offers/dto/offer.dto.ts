import {
  ApiProperty,
  ApiPropertyOptional,
  IntersectionType,
  PickType,
} from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto, _IdDto } from 'src/commondto';

export class CreateOfferDto {
  @IsOptional()
  @ApiProperty()
  offerName: string;

  @IsOptional()
  @ApiProperty()
  offerImage?: string;

  @IsOptional()
  @ApiPropertyOptional()
  isActive: boolean;

  @IsOptional()
  @ApiPropertyOptional()
  createdBy: string;
}

export class UpdateOfferDto extends IntersectionType(CreateOfferDto, _IdDto) {}
export class OfferDto {
  @IsString()
  @ApiProperty()
  offerName: string;

  @IsString()
  @ApiProperty()
  offerImage: string;

  @IsOptional()
  @ApiPropertyOptional()
  isActive: boolean;

  @IsString()
  @ApiPropertyOptional()
  createdBy: string;
}

export class OfferQueryDto extends IntersectionType(
  PaginationQueryDto,
  PickType(UpdateOfferDto, ['offerName'] as const),
) {}
