import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage } from 'mongoose';
import { Category } from 'src/category/schema/category.schema';
import { Offer } from 'src/offers/schema/offers.schema';
import { Platform } from 'src/platforms/schema/platforms.schema';
import { ProductQueryDto } from 'src/products/dto/product.dto';
import { Product } from 'src/products/schema/product.schema';
import { SettingService } from 'src/setting/setting.service';
import {
  getAggregatePaginatedResponse,
  getCursorPaginatedResult,
  getPagination,
} from 'src/utils/getPaginatedResponse';
import { NotificationToken } from './shcema/notificationToken.schema';
import { PaginationQueryDto } from 'src/commondto';
import { AmazonTracking } from 'src/product-tracking/schema/amazon-tracking.schema';

@Injectable()
export class AppApisService {
  constructor(
    @InjectModel(Category.name) private category: Model<Category>,
    @InjectModel(Offer.name) private offer: Model<Offer>,
    @InjectModel(Product.name) private product: Model<Product>,
    @InjectModel(NotificationToken.name)
    private notificationToken: Model<NotificationToken>,

    @InjectModel(AmazonTracking.name)
    private amazonTracking: Model<AmazonTracking>,

    private settingService: SettingService,
  ) {}
  // async getHomePage() {
  //   const categories = await this.category.aggregate([
  //     {
  //       $match: {
  //         isActive: true,
  //         // showInHomepage: true,
  //       },
  //     },
  //     {
  //       $lookup: {
  //         from: 'products',

  //         localField: '_id',
  //         foreignField: 'categoryId',
  //         as: 'products',
  //       },

  //       // showInHomepage: true,
  //     },
  //     {
  //       $addFields: {
  //         productCount: { $size: '$products' },
  //       },
  //     },
  //     {
  //       $match: { productCount: { $gt: 0 } },
  //     },
  //   ]);

  //   const offers = await this.offer.find({
  //     isActive: true,
  //     showInHomepage: true,
  //   });

  //   const productData = await this.product.aggregate([
  //     {
  //       $match: {
  //         isActive: true,
  //         isExpired: false,
  //       },
  //     },

  //     // { $sort: { createdDate: -1 } },
  //     {
  //       $lookup: {
  //         from: 'categories',
  //         localField: 'categoryId',
  //         foreignField: '_id',
  //         as: 'category',
  //       },
  //     },
  //     {
  //       $lookup: {
  //         from: 'platforms',
  //         localField: 'platformId',
  //         foreignField: '_id',
  //         as: 'platformId',
  //       },
  //     },
  //     {
  //       $unwind: '$platformId',
  //     },
  //     {
  //       $unwind: '$category',
  //     },
  //     {
  //       $sort: { createdAt: -1 },
  //     },

  //     {
  //       $group: {
  //         _id: '$category.categoryName',
  //         categoryName: { $first: '$category.categoryName' },
  //         categoryId: { $first: '$category._id' },

  //         products: { $push: '$$ROOT' },
  //       },
  //     },
  //     {
  //       $project: {
  //         products: { $slice: ['$products', 10] },
  //         categoryName: 1,
  //         categoryId: 1,

  //         // "submitted": 1
  //       },
  //     },
  //     // {
  //     //   $project: {
  //     //     categoryName: '$categoryName',
  //     //     products: '$products',
  //     //     lastProduct: { $last: '$products._id' },
  //     //   },
  //     // },
  //     // {
  //     //   $lookup: {
  //     //     from: 'products',
  //     //     let: { lastId: '$lastProduct' },
  //     //     pipeline: [{ $match: { $expr: { $gt: ['$_id', '$$lastId'] } } }],
  //     //     as: 'nextProduct',
  //     //   },
  //     // },
  //   ]);

  //   // console.log(
  //   //   'productData',
  //   //   categories.filter((el) => el.productCount === 0),
  //   // );
  //   return {
  //     categories: categories,
  //     offers,
  //     productData: productData,
  //   };
  // }

  async getHomePage() {
    const categories = await this.category.aggregate([
      {
        $match: {
          isActive: true,
          // showInHomepage: true,
        },
      },
      {
        $lookup: {
          from: 'products',

          localField: '_id',
          foreignField: 'categoryId',
          as: 'products',
        },

        // showInHomepage: true,
      },
      {
        $addFields: {
          productCount: { $size: '$products' },
        },
      },
      {
        $match: { productCount: { $gt: 0 } },
      },
    ]);
    const lootDealCategory = await this.category.findOne({
      categoryName: 'Loot Deals',
    });

    const lootDealsProducts = await this.product
      .find({
        categoryId: { $in: lootDealCategory._id },
        isActive: true,
        isExpired: false,
      })
      .populate([
        { path: 'categoryId', model: Category.name },
        { path: 'platformId', model: Platform.name },
      ])
      .sort({ createdAt: -1 });

    // console.log('lootDealsProducts', lootDealsProducts);

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
        $group: {
          _id: '$_id',
          productName: { $first: '$productName' },
          productImage: { $first: '$productImage' },
          platformName: { $first: '$platformName' },
          categoryId: { $first: '$categoryId' },
          platformId: { $first: '$platformId' },
          createdAt: { $first: '$createdAt' },
          discount: { $first: '$discount' },
          productUrl: { $first: '$productUrl' },
          salePrice: { $first: '$salePrice' },
          basePrice: { $first: '$basePrice' },
          isManyProducts: { $first: '$isManyProducts' },
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      // {
      //   $group: {
      //     _id: '$category.categoryName',
      //     categoryName: { $first: '$category.categoryName' },
      //     categoryId: { $first: '$category._id' },

      //     products: { $push: '$$ROOT' },
      //   },
      // },
      // {
      //   $project: {
      //     products: { $slice: ['$products', 100] },
      //     categoryName: 1,
      //     categoryId: 1,

      //     // "submitted": 1
      //   },
      // },
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

    // console.log('productData', productData);

    return {
      categories: categories,
      lootDealCategory: lootDealCategory,
      lootDeals: lootDealsProducts,
      offers,
      productData: productData,
    };
  }
  async getHomePageV2() {
    const categories = await this.category.aggregate([
      {
        $match: {
          isActive: true,
          // showInHomepage: true,
        },
      },
      {
        $lookup: {
          from: 'products',

          localField: '_id',
          foreignField: 'categoryId',
          as: 'products',
        },

        // showInHomepage: true,
      },
      {
        $addFields: {
          productCount: { $size: '$products' },
        },
      },
      {
        $match: { productCount: { $gt: 0 } },
      },
    ]);
    const lootDealCategory = await this.category.findOne({
      categoryName: 'Loot Deals',
    });

    const lootDealsProducts = await this.product
      .find({
        categoryId: { $in: lootDealCategory._id },
        isActive: true,
        isExpired: false,
      })
      .populate([
        { path: 'categoryId', model: Category.name },
        { path: 'platformId', model: Platform.name },
      ])
      .sort({ createdAt: -1 });

    // console.log('lootDealsProducts', lootDealsProducts);

    const offers = await this.offer.find({
      isActive: true,
      showInHomepage: true,
    });

    // console.log('productData', productData);
    const productData = await this.getAllProducts({ page: 1, pageSize: '30' });
    // console.log('prodduct data', productData);
    return {
      categories: categories,
      lootDealCategory: lootDealCategory,
      lootDeals: lootDealsProducts,
      offers,
      productData: productData,
    };
  }
  async getAllProducts(query?: PaginationQueryDto) {
    const pipeLine: PipelineStage[] = [
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
        $group: {
          _id: '$_id',
          productName: { $first: '$productName' },
          productImage: { $first: '$productImage' },
          platformName: { $first: '$platformName' },
          categoryId: { $first: '$categoryId' },
          platformId: { $first: '$platformId' },
          createdAt: { $first: '$createdAt' },
          discount: { $first: '$discount' },
          productUrl: { $first: '$productUrl' },
          salePrice: { $first: '$salePrice' },
          basePrice: { $first: '$basePrice' },
          isManyProducts: { $first: '$isManyProducts' },
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ];
    return await getAggregatePaginatedResponse({
      model: this.product,
      findQuery: {},
      pipeLines: pipeLine,
      pageQuery: query,
    });
  }

  async settingData() {
    return await this.settingService.get();
  }

  async increaseProductViewCount(id: string) {
    // return await this.settingService.get();
    await this.product.findByIdAndUpdate(id, { $inc: { viewCount: 1 } });
  }

  async registerNotificationToken(token: string) {
    if (token) {
      const findOne = await this.amazonTracking.findOne({
        notificationToken: token,
      });
      if (!findOne && token)
        return await this.amazonTracking.create({ notificationToken: token });

      return findOne;
    }
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
    return await this.product.findById(id).populate('platformId');
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

      productName: { $regex: productName, $options: 'i' },
    };
  }

  query = {
    ...query,
    isActive: true,
    isExpired: false,
  };
  return query;
};
