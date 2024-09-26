import { ApiProperty } from '@nestjs/swagger';
import { IAmazonProduct } from 'src/products/dto/product.dto';

export class AddAmazonProductToTracking {
  @ApiProperty()
  notificationToken: string;

  @ApiProperty()
  productId: string;
}
export class GetAmazonProductToTracking {
  @ApiProperty()
  notificationToken: string;

  @ApiProperty()
  products: IAmazonProduct[];
}
export class GetMyTrackingProducts {
  @ApiProperty()
  notificationToken: string;
}
