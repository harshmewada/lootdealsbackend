import { Module } from '@nestjs/common';
import { DashboardreportsService } from './dashboardreports.service';
import { DashboardreportsController } from './dashboardreports.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from 'src/products/schema/product.schema';
import {
  NotificationToken,
  NotificationTokenSchema,
} from 'src/app-apis/shcema/notificationToken.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: NotificationToken.name, schema: NotificationTokenSchema },
    ]),
  ],
  controllers: [DashboardreportsController],
  providers: [DashboardreportsService],
})
export class DashboardreportsModule {}
