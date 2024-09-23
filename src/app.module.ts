import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AdminsModule } from './admins/admins.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './interceptors/Response.interceptor';
import { PlatformsModule } from './platforms/platforms.module';
import { FilehostModule } from './filehost/filehost.module';
import { CategoryModule } from './category/category.module';
import { ProductsModule } from './products/products.module';
import { BullModule } from '@nestjs/bull';
import { QueueConsumer } from './queues/queues.consumer';
import { OffersModule } from './offers/offers.module';
import { SettingModule } from './setting/setting.module';
import { AppApisModule } from './app-apis/app-apis.module';
import { logger } from './middleware/logger.middleware';
import { NotificationModule } from './notification/notification.module';
import { DashboardreportsModule } from './dashboardreports/dashboardreports.module';
import { AppErrorModule } from './app-error/app-error.module';
import { Product, ProductSchema } from './products/schema/product.schema';
import { Category, CategorySchema } from './category/schema/category.schema';
import { Platform, PlatformSchema } from './platforms/schema/platforms.schema';
import { Setting, SettingSchema } from './setting/schema/setting.schema';
import { Offer, OfferSchema } from './offers/schema/offers.schema';
@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('REDIS_URL'),
          port: configService.get<number>('REDIS_PORT'),
        },
        defaultJobOptions: {
          removeOnComplete: true,
          removeOnFail: true,
        },
      }),

      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: 'queue',
    }),
    ConfigModule.forRoot({
      envFilePath: './config/.env.development',
      // isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DB_URL'),
      }),

      inject: [ConfigService],
    }),

    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Offer.name, schema: OfferSchema },

      { name: Platform.name, schema: PlatformSchema },
      { name: Setting.name, schema: SettingSchema },
    ]),
    AdminsModule,
    AuthModule,
    PlatformsModule,
    FilehostModule,
    CategoryModule,
    ProductsModule,
    OffersModule,
    SettingModule,
    AppApisModule,
    NotificationModule,
    DashboardreportsModule,
    AppErrorModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    QueueConsumer,
  ],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(logger).forRoutes('*');
  // }
}
