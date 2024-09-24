import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SettingDto } from './dto/setting.dto';
import { Setting } from './schema/setting.schema';

@Injectable()
export class SettingService {
  constructor(@InjectModel(Setting.name) private setting: Model<Setting>) {}

  async update(data: SettingDto) {
    console.log('setting data', data);
    const checkSetting = await this.setting.findOne();
    if (!checkSetting) {
      return await this.setting.create(data);
    }

    return await this.setting
      .findByIdAndUpdate(checkSetting._id, data)
      .setOptions({ new: true });
  }

  async get() {
    return await this.setting.findOne();
  }
}
