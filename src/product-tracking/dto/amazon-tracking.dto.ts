import { ApiProperty } from '@nestjs/swagger';

export class AddAmazonProductToTracking {
  @ApiProperty()
  notificationToken: string;

  @ApiProperty()
  productUrl: string;
}
export class AmazonProductToTracking {
  @ApiProperty()
  notificationToken: string;

  @ApiProperty()
  productUrl: string[];
}
export class GetMyTrackingProducts {
  @ApiProperty()
  notificationToken: string;
}
