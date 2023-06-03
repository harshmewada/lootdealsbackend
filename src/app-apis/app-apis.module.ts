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

@Module({
  imports: [
    SettingModule,
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
      { name: Offer.name, schema: OfferSchema },
      { name: AppError.name, schema: AppErrorSchema },

      { name: Product.name, schema: ProductSchema },
      { name: Setting.name, schema: SettingSchema },
      { name: NotificationToken.name, schema: NotificationTokenSchema },
    ]),
  ],
  controllers: [AppApisController],
  providers: [AppApisService, SettingService, AppErrorService],
})
export class AppApisModule {}
