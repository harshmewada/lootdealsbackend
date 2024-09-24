import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  NotificationToken,
  NotificationTokenSchema,
} from 'src/app-apis/shcema/notificationToken.schema';
import {
  AmazonTracking,
  AmazonTrackingSchema,
} from 'src/product-tracking/schema/amazon-tracking.schema';
import { ProductTrackingService } from 'src/product-tracking/product-tracking.service';
import { ProductsService } from 'src/products/products.service';
import { ProductTrackingModule } from 'src/product-tracking/product-tracking.module';
import { ProductsModule } from 'src/products/products.module';
import { Product, ProductSchema } from 'src/products/schema/product.schema';
import {
  Platform,
  PlatformSchema,
} from 'src/platforms/schema/platforms.schema';
import { Category, CategorySchema } from 'src/category/schema/category.schema';

@Module({
  imports: [
    ProductsModule,
    MongooseModule.forFeature([
      { name: NotificationToken.name, schema: NotificationTokenSchema },
      { name: AmazonTracking.name, schema: AmazonTrackingSchema },

      { name: Product.name, schema: ProductSchema },

      { name: Platform.name, schema: PlatformSchema },
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
