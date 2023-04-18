import { Module } from '@nestjs/common';
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

const DB_URL = process.env.DB_URL || 'mongodb://127.0.0.1:27017/lootdealsv2';

@Module({
  imports: [
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
    AdminsModule,
    AuthModule,
    PlatformsModule,
    FilehostModule,
    CategoryModule,
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
