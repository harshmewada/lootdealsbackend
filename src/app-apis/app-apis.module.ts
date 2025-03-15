import { Module } from '@nestjs/common';
import { AppApisService } from './app-apis.service';
import { AppApisController } from './app-apis.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from 'src/category/schema/category.schema';
import { Product, ProductSchema } from 'src/products/schema/product.schema';
import { Setting, SettingSchema } from 'src/setting/schema/setting.schema';
import { SettingModule } from 'src/setting/setting.module';
import { SettingService } from 'src/setting/setting.service';
import { Offer, OfferSchema } from 'src/offers/schema/offers.schema';
import {
  NotificationToken,
  NotificationTokenSchema,
} from './shcema/notificationToken.schema';
import { AppErrorService } from 'src/app-error/app-error.service';
import { AppError, AppErrorSchema } from 'src/app-error/schema/apperror.schema';
import { ProductTrackingService } from 'src/product-tracking/product-tracking.service';
import {
  AmazonTracking,
  AmazonTrackingSchema,
} from 'src/product-tracking/schema/amazon-tracking.schema';
import { ProductsService } from 'src/products/products.service';
import {
  Platform,
  PlatformSchema,
} from 'src/platforms/schema/platforms.schema';
import { ConfigModule } from '@nestjs/config';
import { NotificationService } from 'src/notification/notification.service';
import { BullModule } from '@nestjs/bullmq';
import { NOTIFICATIONACTIONS } from 'src/constants';

@Module({
  imports: [
    SettingModule,
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
      { name: Category.name, schema: CategorySchema },
      { name: Offer.name, schema: OfferSchema },
      { name: AppError.name, schema: AppErrorSchema },

      { name: Product.name, schema: ProductSchema },
      { name: Platform.name, schema: PlatformSchema },

      { name: Setting.name, schema: SettingSchema },
      { name: NotificationToken.name, schema: NotificationTokenSchema },
      { name: AmazonTracking.name, schema: AmazonTrackingSchema },
    ]),
  ],
  controllers: [AppApisController],
  providers: [
    AppApisService,
    SettingService,
    AppErrorService,
    ProductTrackingService,
    ProductsService,
    NotificationService,
  ],
})
export class AppApisModule {}
