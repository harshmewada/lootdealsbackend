import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schema/product.schema';
import {
  Platform,
  PlatformSchema,
} from 'src/platforms/schema/platforms.schema';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import {
  NotificationToken,
  NotificationTokenSchema,
} from 'src/app-apis/shcema/notificationToken.schema';
import { NotificationService } from 'src/notification/notification.service';
import { Category, CategorySchema } from 'src/category/schema/category.schema';
import {
  AmazonTracking,
  AmazonTrackingSchema,
} from 'src/product-tracking/schema/amazon-tracking.schema';
import { ProductTrackingService } from 'src/product-tracking/product-tracking.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'queue',
    }),
    ConfigModule,
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },

      { name: Platform.name, schema: PlatformSchema },
      { name: Category.name, schema: CategorySchema },

      { name: NotificationToken.name, schema: NotificationTokenSchema },
      { name: AmazonTracking.name, schema: AmazonTrackingSchema },
    ]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService, NotificationService, ProductTrackingService],
  exports: [ProductsService],
})
export class ProductsModule {}
