import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from 'src/category/schema/category.schema';
import { Offer } from 'src/offers/schema/offers.schema';
import { Platform } from 'src/platforms/schema/platforms.schema';
import { ProductQueryDto } from 'src/products/dto/product.dto';
import { Product } from 'src/products/schema/product.schema';
import { SettingService } from 'src/setting/setting.service';
import {
  getCursorPaginatedResult,
  getPagination,
} from 'src/utils/getPaginatedResponse';

@Injectable()
export class AppApisService {
  constructor(
    @InjectModel(Category.name) private category: Model<Category>,
    @InjectModel(Offer.name) private offer: Model<Offer>,
    @InjectModel(Product.name) private product: Model<Product>,

    private settingService: SettingService,
  ) {}
  async getHomePage() {
    const categories = await this.category.find({
      isActive: true,
      // showInHomepage: true,
    });

    const offers = await this.offer.find({
      isActive: true,
      showInHomepage: true,
    });

    const productData = await this.product.aggregate([
      {
        $match: {
          isActive: true,
          isExpired: false,
        },
      },

      // { $sort: { createdDate: -1 } },
      {
        $lookup: {
          from: 'categories',
          localField: 'categoryId',
          foreignField: '_id',
          as: 'category',
        },
      },
      {
        $lookup: {
          from: 'platforms',
          localField: 'platformId',
          foreignField: '_id',
          as: 'platformId',
        },
      },
      {
        $unwind: '$platformId',
      },
      {
        $unwind: '$category',
      },
      {
        $sort: { createdAt: -1 },
      },

      {
        $group: {
          _id: '$category.categoryName',
          categoryName: { $first: '$category.categoryName' },

          products: { $push: '$$ROOT' },
        },
      },
      {
        $project: {
          products: { $slice: ['$products', 10] },
          categoryName: 1,
          // "submitted": 1
        },
      },
      // {
      //   $project: {
      //     categoryName: '$categoryName',
      //     products: '$products',
      //     lastProduct: { $last: '$products._id' },
      //   },
      // },
      // {
      //   $lookup: {
      //     from: 'products',
      //     let: { lastId: '$lastProduct' },
      //     pipeline: [{ $match: { $expr: { $gt: ['$_id', '$$lastId'] } } }],
      //     as: 'nextProduct',
      //   },
      // },
    ]);

    console.log('productData', productData);
    return {
      categories,
      offers,
      productData: productData,
    };
  }

  async settingData() {
    return await this.settingService.get();
  }

  async increaseProductViewCount(id: string) {
    // return await this.settingService.get();
    await this.product.findByIdAndUpdate(id, { $inc: { viewCount: 1 } });
  }

  async getProducts(query: ProductQueryDto) {
    // console.log('_id', query.next);

    // await new Promise((resolve) => setTimeout(resolve, 5500));
    const response = await getCursorPaginatedResult(
      this.product,
      query,
      (q: ProductQueryDto) => generateProductQuery(q),
      true,
      [{ path: 'platformId', model: Platform.name }],
    );

    // console.log('response', response);
    return response;
  }

  async getProduct(id: string) {
    return await this.product.findById(id);
  }

  async getCategories() {
    return await this.category.find({ isActive: true });
  }

  async getOffers() {
    return await this.offer.find({ isActive: true });
  }
}

const generateProductQuery = (data: ProductQueryDto) => {
  const { productName, categoryId, next } = data;

  let query = {};

  if (next) {
    query = {
      ...query,
      _id: { $lt: next },
    };
  }

  if (categoryId) {
    query = {
      ...query,
      categoryId: categoryId,
    };
  }

  if (productName) {
    query = {
      ...query,

      productName: { $regex: productName },
    };
  }

  query = {
    ...query,
    isActive: true,
    isExpired: false,
  };
  return query;
};
