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
import {
  ProductPriceCheckProcessor,
  SendNotificationProcessor,
  SubscribedCategoriesNotificationProcessor,
} from './notification.processor';
import { BullModule } from '@nestjs/bullmq';
import { NOTIFICATIONACTIONS } from 'src/constants';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ProductsModule,
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

    BullModule.registerQueue({
      name: NOTIFICATIONACTIONS.SEND_FIREBASE_NOTIFICATION,
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: true,
      },
    }),
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
