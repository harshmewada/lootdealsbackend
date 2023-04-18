import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { query } from 'express';
import { Model } from 'mongoose';
import { PaginationQueryDto } from 'src/commondto';
import { getPaginatedResponse } from 'src/utils/getPaginatedResponse';
import {
  PlatformDto,
  PlatformQueryDto,
  UpdatePlatformDto,
} from './dto/platform.dto';
import { Platform } from './schema/platforms.schema';

@Injectable()
export class PlatformsService {
  constructor(@InjectModel(Platform.name) private platform: Model<Platform>) {}
  async create(createPlatformDto: PlatformDto) {
    return await this.platform.create(createPlatformDto);
  }

  async update(createPlatformDto: UpdatePlatformDto) {
    return await this.platform.findByIdAndUpdate(createPlatformDto._id, {
      ...createPlatformDto,
    });
  }

  async deleteOne(id: string) {
    return await this.platform.findByIdAndDelete(id);
  }
  async find(Query: PlatformQueryDto) {
    // await new Promise((resolve) => setTimeout(resolve, 5000));
    return await getPaginatedResponse({
      model: this.platform,
      pageQuery: Query,
      findQuery: platformQuery(Query),
    });
  }

  async findAll() {
    const allPlat = await this.platform.find();
    return { data: allPlat };
  }
}

const platformQuery = ({ platformName }: PlatformQueryDto) => {
  return (
    platformName && {
      platformName: { $regex: platformName, $options: 'i' },
    }
  );
};
