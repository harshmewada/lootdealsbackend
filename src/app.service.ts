import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './products/schema/product.schema';
import { Model } from 'mongoose';
import { existsSync, readdirSync, unlink, unlinkSync } from 'fs';
import * as path from 'path';
import { Platform } from './platforms/schema/platforms.schema';
import { Category } from './category/schema/category.schema';
import { Offer } from './offers/schema/offers.schema';
import { Setting } from './setting/schema/setting.schema';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  constructor(
    private configService: ConfigService,
    @InjectModel(Product.name) private Products: Model<Product>,
    @InjectModel(Platform.name) private Platforms: Model<Platform>,
    @InjectModel(Category.name) private Categorys: Model<Category>,
    @InjectModel(Offer.name) private Offers: Model<Offer>,
    @InjectModel(Setting.name) private Settings: Model<Setting>,
  ) {}

  async onApplicationBootstrap() {
    const listAllProducts = await this.Products.find().select('productImage');
    const listAllCategories = await this.Categorys.find().select(
      'categoryImage',
    );
    const listAllPlatforms = await this.Platforms.find().select(
      'platformImage',
    );
    const listAllOfferss = await this.Offers.find().select('offerImage');
    const telegramBanner = await this.Settings.findOne();

    const images = [
      ...listAllProducts.map((e) => e.productImage),
      ...listAllCategories.map((e) => e.categoryImage),
      ...listAllPlatforms.map((e) => e.platformImage),
      ...listAllOfferss.map((e) => e.offerImage),
      telegramBanner.telegramBannerImage,
      telegramBanner.trackingBannerImage,
    ];

    const fileList = readdirSync(path.join(__dirname, '../uploads'));

    let filesToDelete = fileList.filter((x) => !images.includes(x));
    // console.log(
    //   'fileList',
    //   fileList.length,
    //   images.length,
    //   filesToDelete.length,
    // );

    filesToDelete.forEach((file) => {
      const fpath = path.join(__dirname, '../uploads', file);
      existsSync(fpath) && unlinkSync(fpath);
    });
  }
  getHello(): string {
    const dbUser = this.configService.get<string>('DATABASE_USER');
    console.log('dbUser', dbUser);
    return dbUser + process.env.NODEENV;
  }
}
