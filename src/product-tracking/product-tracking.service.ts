import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AmazonTracking } from './schema/amazon-tracking.schema';
import {
  AddAmazonProductToTracking,
  GetMyTrackingProducts,
} from './dto/amazon-tracking.dto';

@Injectable()
export class ProductTrackingService {
  constructor(
    @InjectModel(AmazonTracking.name)
    private amazonTracking: Model<AmazonTracking>,
  ) {}

  async addAmazonProductToTracking(data: AddAmazonProductToTracking) {}

  async getMyTrackingProducts(query: GetMyTrackingProducts) {}
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
