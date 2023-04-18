import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ObjectId } from 'mongoose';

export class _IdDto {
  @ApiProperty()
  _id: ObjectId;
}

export class PaginationQueryDto {
  @ApiPropertyOptional()
  page?: string;

  @ApiPropertyOptional()
  pageSize?: string;

  @ApiPropertyOptional()
  next?: string;

  @ApiPropertyOptional()
  previous?: string;
}
