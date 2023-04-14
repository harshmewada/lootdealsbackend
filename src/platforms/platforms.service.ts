import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PlatformDto } from './dto/platform.dto';
import { Platform } from './schema/platforms.schema';

@Injectable()
export class PlatformsService {
  constructor(@InjectModel(Platform.name) private platform: Model<Platform>) {}
  async create(createPlatformDto: PlatformDto) {
    return await this.platform.create(createPlatformDto);
  }

  async findAll() {
    return this.platform.find();
  }
}
