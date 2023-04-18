import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Platform } from 'src/platforms/schema/platforms.schema';
import { getPaginatedResponse } from 'src/utils/getPaginatedResponse';
import {
  ProductDto,
  ProductQueryDto,
  UpdateProductDto,
} from './dto/product.dto';
import { Product } from './schema/product.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private product: Model<Product>,
    @InjectModel(Platform.name) private platform: Model<Platform>,
  ) {}
  async create(createProductDto: ProductDto) {
    const platform = await this.platform.findById(createProductDto.platformId);
    return await this.product.create({
      ...createProductDto,
      platformName: platform.platformName,
    });
  }

  async update(createProductDto: UpdateProductDto) {
    return await this.product.findByIdAndUpdate(createProductDto._id, {
      ...createProductDto,
    });
  }

  async deleteOne(id: string) {
    return await this.product.findByIdAndDelete(id);
  }
  async findAll(Query: ProductQueryDto) {
    // await new Promise((resolve) => setTimeout(resolve, 5000));
    return await getPaginatedResponse({
      model: this.product,
      pageQuery: Query,
      findQuery: productQuery(Query),
    });
  }
}

const productQuery = ({ productName }: ProductQueryDto) => {
  return (
    productName && {
      productName: { $regex: productName, $options: 'i' },
    }
  );
};
