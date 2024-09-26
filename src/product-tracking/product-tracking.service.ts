import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AmazonTracking } from './schema/amazon-tracking.schema';
import {
  AddAmazonProductToTracking,
  GetMyTrackingProducts,
} from './dto/amazon-tracking.dto';
import { ProductsService } from 'src/products/products.service';
import { CateGoryTrackingDto } from 'src/category/dto/category.dto';
import { AgendaService } from '@agent-ly/nestjs-agenda';

@Injectable()
export class ProductTrackingService {
  constructor(
    @InjectModel(AmazonTracking.name)
    private amazonTracking: Model<AmazonTracking>,

    private productService: ProductsService,
    private agendaService: AgendaService,
  ) {}

  async addAmazonProductToTracking(data: AddAmazonProductToTracking) {
    let findRecord = await this.amazonTracking.findOne({
      notificationToken: data.notificationToken,
    });
    if (!findRecord) {
      findRecord = await this.amazonTracking.create({
        notificationToken: data.notificationToken,
      });
    }
    if (findRecord.products.length == 3) {
      throw new BadRequestException('You can track upto only 3 products');
    }

    const product = await this.productService.getAmazonProduct(data.productId);

    if (
      findRecord.products.some(
        (e) => e.amazonProductId === product.amazonProductId,
      )
    ) {
      throw new BadRequestException(
        'We are already tracking this product for you',
      );
    }
    // console.log('product', product);
    if (!product) {
      throw new BadRequestException('Product not found');
    }

    const update = await this.amazonTracking.findByIdAndUpdate(findRecord._id, {
      products: [...findRecord.products, product],
    });
  }

  async getMyTrackingProducts(query: GetMyTrackingProducts) {
    if (query.notificationToken)
      return await this.amazonTracking.findOne({
        notificationToken: query.notificationToken,
      });

    return [];
  }

  async removeAmazonProductToTracking(data: AddAmazonProductToTracking) {
    const findRecord = await this.amazonTracking.findOne({
      notificationToken: data.notificationToken,
    });

    const update = await this.amazonTracking
      .findByIdAndUpdate(findRecord.id, {
        products: findRecord.products.filter(
          (e) => e.amazonProductId !== data.productId,
        ),
      })
      .setOptions({ new: true });
  }

  async addCategoryToTrack(data: CateGoryTrackingDto) {
    const findRecord = await this.amazonTracking.findOne({
      notificationToken: data.notificationToken,
    });
    if (findRecord) {
      return await this.amazonTracking.findOneAndUpdate({
        notificationToken: data.notificationToken,
        categories: data.categories,
      });
    } else {
      return await this.amazonTracking.create({
        notificationToken: data.notificationToken,
        categories: data.categories,
      });
    }
  }

  // async sendSubsribedCategoryNotification(categoryId) {
  //   const findTokens = await this.amazonTracking.aggregate([
  //     {
  //       $match: {
  //         $expr: { $in: ['$categories', { $toObjectId: categoryId }] },
  //       },
  //     },
  //     {
  //       $group: {
  //         _id: '$notificationToken',
  //       },
  //     },
  //   ]);

  //   console.log('findTokens', findTokens);
  // }
  //   async update(data: SettingDto) {
  //     const checkSetting = await this.setting.findOne();
  //     if (!checkSetting) {
  //       return await this.setting.create(data);
  //     }

  //     return await this.setting
  //       .findByIdAndUpdate(checkSetting._id, data)
  //       .setOptions({ new: true });
  //   }

  //   async get() {
  //     return await this.setting.findOne();
  //   }
}
