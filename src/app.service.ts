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
import { AmazonTracking } from './product-tracking/schema/amazon-tracking.schema';
import * as crypto from 'crypto';
@Injectable()
export class AppService implements OnApplicationBootstrap {
  constructor(
    private configService: ConfigService,
    @InjectModel(Product.name) private Products: Model<Product>,
    @InjectModel(Platform.name) private Platforms: Model<Platform>,
    @InjectModel(Category.name) private Categorys: Model<Category>,
    @InjectModel(Offer.name) private Offers: Model<Offer>,
    @InjectModel(Setting.name) private Settings: Model<Setting>,
    @InjectModel(AmazonTracking.name)
    private amazonTracking: Model<AmazonTracking>,
  ) {}

  async onApplicationBootstrap() {
    // await this.generateDummyTrackingTokens();
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

  async generateDummyTrackingTokens() {
    await this.amazonTracking.insertMany(
      new Array(10000).fill('_').map((e, eI) => {
        return {
          notificationToken: crypto.randomBytes(20).toString('hex'),
          categories: [
            '647b0665acc54c9f7af89f42',
            '647b073cfc976c4df4e60139',

            '647b0567acc54c9f7af89f3e',
          ],
          products: [
            {
              productName:
                'Amazfit Balance - AI Smartwatch, Fitness Coach, Sleep & Health Tracker with Body Composition, 1.5" AMOLED Display, Bluetooth Calls, Alexa Built-in, Dual-Band GPS, 14-Day Battery (Midnight)',
              productImage:
                'https://m.media-amazon.com/images/I/41uaXPCW73L._SL500_.jpg',
              productUrl:
                'https://www.amazon.in/dp/B0CDX8H6XF?tag=thekdtech21-21&linkCode=ogi&th=1&psc=1',
              basePrice: '30999',
              salePrice: '19999',
              amazonProductId: 'B0CDX8H6XF',
              isActive: true,
            },
          ],
        };
      }),
    );
  }
  getHello(): string {
    const dbUser = this.configService.get<string>('DATABASE_USER');
    console.log('dbUser', dbUser);
    return dbUser + process.env.NODEENV;
  }
}
