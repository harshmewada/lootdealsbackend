import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NotificationToken } from 'src/app-apis/shcema/notificationToken.schema';
import { Product } from 'src/products/schema/product.schema';

@Injectable()
export class DashboardreportsService {
  constructor(
    @InjectModel(Product.name) private products: Model<Product>,
    @InjectModel(NotificationToken.name)
    private notificationTokens: Model<NotificationToken>,
  ) {}
  async getDashboard() {
    const totalProducts = await this.products.count();
    const expiredProducts = await this.products.count({ isExpired: true });

    const totalUsers = await this.notificationTokens.count();

    return {
      products: totalProducts,
      users: totalUsers,
      expiredProducts,
    };
  }
}
