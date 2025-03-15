import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AmazonTracking,
  AmazonTrackingSchema,
} from './schema/amazon-tracking.schema';
import { ProductTrackingController } from './product-tracking.controller';
import { ProductTrackingService } from './product-tracking.service';
import { ProductsService } from 'src/products/products.service';
import { ProductsModule } from 'src/products/products.module';
import { Product, ProductSchema } from 'src/products/schema/product.schema';
import {
  Platform,
  PlatformSchema,
} from 'src/platforms/schema/platforms.schema';
import { Category, CategorySchema } from 'src/category/schema/category.schema';
import { CategoryModule } from 'src/category/category.module';
import {
  NotificationToken,
  NotificationTokenSchema,
} from 'src/app-apis/shcema/notificationToken.schema';
import { ConfigModule } from '@nestjs/config';
import { NotificationService } from 'src/notification/notification.service';
import { BullModule } from '@nestjs/bullmq';
import { NOTIFICATIONACTIONS } from 'src/constants';

@Module({
  imports: [
    ConfigModule,
    BullModule.registerQueue({
      name: NOTIFICATIONACTIONS.CHECK_MY_PRODUCT_PRICE,
    }),
    BullModule.registerQueue({
      name: NOTIFICATIONACTIONS.SEND_PRODUCT_NOTIFICATION,
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: true,
      },
    }),
    BullModule.registerQueue({
      name: NOTIFICATIONACTIONS.SEND_TO_SUBSCRIBED_CATEGORIES,
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: true,
      },
    }),
    MongooseModule.forFeature([
      { name: AmazonTracking.name, schema: AmazonTrackingSchema },
      { name: Product.name, schema: ProductSchema },

      { name: Platform.name, schema: PlatformSchema },
      { name: Category.name, schema: CategorySchema },

      { name: NotificationToken.name, schema: NotificationTokenSchema },
    ]),
  ],
  controllers: [ProductTrackingController],
  providers: [ProductTrackingService, ProductsService, NotificationService],
  exports: [ProductTrackingService],
})
export class ProductTrackingModule {}
