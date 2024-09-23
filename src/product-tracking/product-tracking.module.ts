import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AmazonTracking,
  AmazonTrackingSchema,
} from './schema/amazon-tracking.schema';
import { ProductTrackingController } from './product-tracking.controller';
import { ProductTrackingService } from './product-tracking.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AmazonTracking.name, schema: AmazonTrackingSchema },
    ]),
  ],
  controllers: [ProductTrackingController],
  providers: [ProductTrackingService],
})
export class ProductTrackingModule {}
