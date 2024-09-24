import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ObjectId } from 'mongoose';

export class _IdDto {
  @ApiProperty()
  _id: ObjectId;
}

export class PaginationQueryDto {
  @ApiPropertyOptional({ default: 'true' })
  paginate?: string = 'true';

  @ApiPropertyOptional({ default: 1 })
  page?: number;

  @ApiPropertyOptional({ default: 10 })
  limit?: number;

  @ApiPropertyOptional()
  pageSize?: string;

  @ApiPropertyOptional()
  next?: string;

  @ApiPropertyOptional()
  previous?: string;

  @ApiPropertyOptional()
  fromDate?: string;

  @ApiPropertyOptional()
  toDate?: string;
}
