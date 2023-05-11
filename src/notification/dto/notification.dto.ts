import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { _IdDto } from 'src/commondto';
import { ProductDto } from 'src/products/dto/product.dto';

export class NotificationPayloadDto {
  @IsString()
  @ApiPropertyOptional()
  title: string;

  @IsString()
  @ApiPropertyOptional()
  body: string;

  @IsString()
  @ApiPropertyOptional()
  imageUrl: string;

  @IsOptional()
  @ApiPropertyOptional()
  productData?: ProductDto;
}
