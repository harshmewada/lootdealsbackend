import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Platform } from 'src/platforms/schema/platforms.schema';
import { getPaginatedResponse } from 'src/utils/getPaginatedResponse';
import { removeFileSync } from 'src/utils/removeFileSync';
import {
  ProductDto,
  ProductQueryDto,
  UpdateProductDto,
} from './dto/product.dto';
import { Product } from './schema/product.schema';
import moment from 'moment';
import { Job, Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { calculateDiscount } from 'src/utils/calculateDiscount';
import { Category } from 'src/category/schema/category.schema';
import { NotificationToken } from 'src/app-apis/shcema/notificationToken.schema';
import { NotificationService } from 'src/notification/notification.service';

const amazonApi = require('amazon-paapi');

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private product: Model<Product>,
    @InjectModel(Platform.name) private platform: Model<Platform>,
    @InjectModel(Category.name) private category: Model<Category>,

    private configService: ConfigService,
    private notificationService: NotificationService, // @InjectQueue('queue') private queue: Queue, // @InjectQueue('queue') private queue: Queue,
  ) {}
  amazonCreds = {
    AccessKey: this.configService.get('AMAZON_ACCESS_KEY'),
    SecretKey: this.configService.get('AMAZON_SECRET_KEY'),
    PartnerTag: this.configService.get('AMAZON_PARTENER_TAG'),
    PartnerType: this.configService.get('AMAZON_PARTNER_TYPE'),
    Marketplace: this.configService.get('AMAZON_MARKETPLACE'),
  };

  async create(createProductDto: ProductDto) {
    const platform = await this.platform.findById(createProductDto.platformId);
    const createdProduct = await this.product.create({
      ...createProductDto,
      platformName: platform.platformName,
      discount: calculateDiscount(
        parseFloat(createProductDto.basePrice),
        parseFloat(createProductDto.salePrice),
      ),
      categoryId: createProductDto.categoryId.split(','),
    });

    const productCategory = await this.category.find({
      _id: { $in: createdProduct.categoryId },
      isActive: true,
    });
    // console.log(
    //   'productCategory',
    //   productCategory,
    //   productCategory.some((el) => el.enableNotification === true),
    // );
    if (productCategory.some((el) => el.enableNotification === true)) {
      await this.notificationService.sendNotification({
        title: `${createdProduct.discount}%off - ${createdProduct.productName}`,
        body: 'New Super Deals Added',
        imageUrl: `${this.configService.get('BASE_IMAGE_URL')}/${
          createdProduct.productImage
        }`,
        data: {
          productName: createdProduct.productName,
          _id: createdProduct._id.toString(),
          type: 'Product',
        } as any,
      });
    }

    return createdProduct;
  }

  async update(createProductDto: UpdateProductDto) {
    return await this.product.findByIdAndUpdate(createProductDto._id, {
      ...createProductDto,
      discount: calculateDiscount(
        parseFloat(createProductDto.basePrice),
        parseFloat(createProductDto.salePrice),
      ),
      categoryId: createProductDto.categoryId.split(','),
    });
  }

  async deleteOne(id: string) {
    const deleted = await this.product.findByIdAndDelete(id);

    removeFileSync(deleted?.productImage);

    return;
  }

  async deleteBatch(ids: string[]) {
    const deleteResponse = await this.product.deleteMany({ _id: { $in: ids } });

    // console.log('batch respiobnse', deleteResponse);

    return deleteResponse.acknowledged;
  }
  async findAll(Query: ProductQueryDto) {
    // await new Promise((resolve) => setTimeout(resolve, 5000));
    return await getPaginatedResponse({
      model: this.product,
      pageQuery: Query,
      findQuery: productQuery(Query),
      populate: [{ path: 'categoryId', model: Category.name }],
    }).then((res) => {
      return {
        ...res,
        data: res.data.map((el) => {
          return {
            ...el._doc,
            categoryId: el.categoryId.map((ct) => ct._id),
            categoryName: el.categoryId.map((ct) => ct.categoryName).join(', '),
          };
        }),
      };
    });
  }

  async getAmazonProduct(productId: string) {
    console.log('productID', productId);
    const requestParameters = {
      ItemIds: [productId],
      Condition: 'New',
      Resources: [
        'Images.Primary.Medium',
        'Images.Primary.Large',

        'ItemInfo.Title',
        'Offers.Listings.Price',
      ],
    };

    const productData = await amazonApi
      .GetItems(this.amazonCreds, requestParameters)
      .then((res) => {
        return JSON.stringify(res);
      })
      .then((data) => {
        const response = JSON.parse(data);
        // console.log('amazon response', response);

        if (response?.Errors?.length > 0) {
          const apiError = response?.Errors?.[0]?.Message;
          throw new HttpException(
            apiError || 'Product error',
            HttpStatus.NO_CONTENT,
            { cause: response.Errors },
          );
        }
        const item = response.ItemsResult.Items[0];
        const productResponse = {
          productName: item.ItemInfo.Title.DisplayValue,
          productUrl: item.DetailPageURL,
          salePrice: item.Offers.Listings[0].Price.Amount,
          basePrice:
            item.Offers.Listings[0].Price.Amount +
            item.Offers.Listings[0].Price.Savings.Amount,
          productImage: item.Images.Primary.Large.URL,
          amazonProductId: productId,
        };
        return productResponse;
      })
      .catch((error) => {
        // catch an error.
        console.log('error', error);
        throw new InternalServerErrorException(error);
      });

    return productData;
  }

  //runs every day

  async priceCheckForLast24hour() {
    try {
      const autoProducts = await this.product.find({
        amazonProductId: { $exists: true },
        createdAt: {
          $gte: moment().startOf('day').toDate(),
          $lte: moment().endOf('day').toDate(),
        },
        isExpired: false,
      });
      // if (autoProducts?.length > 0) {
      //   const requestParameters = {
      //     ItemIds: autoProducts.map((El) => El.amazonProductId),
      //     Condition: 'New',
      //     Resources: [
      //       'Images.Primary.Medium',
      //       'Images.Primary.Large',

      //       'ItemInfo.Title',
      //       'Offers.Listings.Price',
      //     ],
      //   };

      //   const productData = await amazonApi
      //     .GetItems(this.amazonCreds, requestParameters)
      //     .then((res) => {
      //       return JSON.stringify(res);
      //     })
      //     .then((data) => {
      //       const response = JSON.parse(data);

      //       if (response?.Errors?.length > 0) {
      //         throw new Error(response?.Errors);
      //       }
      //       if (response?.ItemsResult?.Items?.length > 0) {
      //         return response?.ItemsResult?.Items?.map((item) => {
      //           return {
      //             productName: item.ItemInfo.Title.DisplayValue,
      //             productUrl: item.DetailPageURL,
      //             salePrice: item.Offers.Listings[0].Price.Amount,
      //             basePrice:
      //               item.Offers.Listings[0].Price.Amount +
      //               item.Offers.Listings[0].Price.Savings.Amount,
      //             productImage: item.Images.Primary.Large.URL,
      //             amazonProductId: item.ASIN,
      //           };
      //         });
      //       }
      //     });

      //   const productToRemove = autoProducts.filter((el) => {
      //     const findReferenceProduct = productData.find(
      //       (a) => a.amazonProductId === el.amazonProductId,
      //     );

      //     if (
      //       findReferenceProduct &&
      //       findReferenceProduct.salePrice > el.salePrice
      //     ) {
      //       return true;
      //     }
      //     return false;
      //   });

      //   if (productToRemove?.length > 0) {
      //     const ids = productToRemove.map((el) => el._id);
      //     await this.product.updateMany(
      //       { _id: { $in: ids } },
      //       { isExpired: true },
      //     );
      //   }
      // }
      let expireCount = 0;
      if (autoProducts?.length > 0) {
        await Promise.all(
          autoProducts.map(async (prod) => {
            const requestParameters = {
              ItemIds: [prod.amazonProductId],
              Condition: 'New',
              Resources: [
                'Images.Primary.Medium',
                'Images.Primary.Large',

                'ItemInfo.Title',
                'Offers.Listings.Price',
              ],
            };

            const productData = await amazonApi
              .GetItems(this.amazonCreds, requestParameters)
              .then((res) => {
                return JSON.stringify(res);
              })
              .then((data) => {
                const response = JSON.parse(data);

                if (response?.Errors?.length > 0) {
                  throw new Error(response?.Errors);
                }
                if (response?.ItemsResult?.Items?.length > 0) {
                  return response?.ItemsResult?.Items?.map((item) => {
                    return {
                      productName: item.ItemInfo.Title.DisplayValue,
                      productUrl: item.DetailPageURL,
                      salePrice: item.Offers.Listings[0].Price.Amount,
                      basePrice:
                        item.Offers.Listings[0].Price.Amount +
                        item.Offers.Listings[0].Price.Savings.Amount,
                      productImage: item.Images.Primary.Large.URL,
                      amazonProductId: item.ASIN,
                    };
                  });
                }
              })
              .catch((err) =>
                console.log('failed to expire ', prod.productName),
              );
            if (productData && productData.length > 0) {
              const findReferenceProduct = productData.find(
                (a) => a.amazonProductId === prod.amazonProductId,
              );

              if (
                findReferenceProduct &&
                findReferenceProduct.salePrice > prod.salePrice
              ) {
                await this.product.findOneAndUpdate(
                  { amazonProductId: prod.amazonProductId },
                  { isExpired: true },
                );
                expireCount = expireCount + 1;
              }
            }

            // if (productToRemove?.length > 0) {
            //   const ids = productToRemove.map((el) => el._id);
            // await this.product.updateMany(
            //   { _id: { $in: ids } },
            //   { isExpired: true },
            // );
            // }
          }),
        );
      }
    } catch (error) {
      console.log('priceCheckForLast24hour error', error);
    }
  }

  async priceCheckManually() {
    try {
      const autoProducts = await this.product.find({
        amazonProductId: { $exists: true },

        isExpired: false,
      });
      let expireCount = 0;
      if (autoProducts?.length > 0) {
        await Promise.all(
          autoProducts.map(async (prod) => {
            const requestParameters = {
              ItemIds: [prod.amazonProductId],
              Condition: 'New',
              Resources: [
                'Images.Primary.Medium',
                'Images.Primary.Large',

                'ItemInfo.Title',
                'Offers.Listings.Price',
              ],
            };

            const productData = await amazonApi
              .GetItems(this.amazonCreds, requestParameters)
              .then((res) => {
                return JSON.stringify(res);
              })
              .then((data) => {
                const response = JSON.parse(data);

                if (response?.Errors?.length > 0) {
                  throw new Error(response?.Errors);
                }
                if (response?.ItemsResult?.Items?.length > 0) {
                  return response?.ItemsResult?.Items?.map((item) => {
                    return {
                      productName: item.ItemInfo.Title.DisplayValue,
                      productUrl: item.DetailPageURL,
                      salePrice: item.Offers.Listings[0].Price.Amount,
                      basePrice:
                        item.Offers.Listings[0].Price.Amount +
                        item.Offers.Listings[0].Price.Savings.Amount,
                      productImage: item.Images.Primary.Large.URL,
                      amazonProductId: item.ASIN,
                    };
                  });
                }
              })
              .catch((err) =>
                console.log('failed to expire ', prod.productName),
              );
            if (productData && productData.length > 0) {
              const findReferenceProduct = productData.find(
                (a) => a.amazonProductId === prod.amazonProductId,
              );

              if (
                findReferenceProduct &&
                findReferenceProduct.salePrice > prod.salePrice
              ) {
                await this.product.findOneAndUpdate(
                  { amazonProductId: prod.amazonProductId },
                  { isExpired: true },
                );
                expireCount = expireCount + 1;
              }
            }

            // if (productToRemove?.length > 0) {
            //   const ids = productToRemove.map((el) => el._id);
            // await this.product.updateMany(
            //   { _id: { $in: ids } },
            //   { isExpired: true },
            // );
            // }
          }),
        );
      }
      console.log('expireCount', expireCount);
      return { message: `${expireCount} Products expired` };
    } catch (error) {
      console.log('priceCheckForLast24hour error', error);
    }
  }
  async sendProductNotification(ids: string[]) {
    console.log('iids', ids);
    let newIds = ids.map(function (el) {
      return new Types.ObjectId(el);
    });

    // const products = await this.product.aggregate([
    //   { $match: { _id: { $in: newIds }, isActive: true } },
    //   // {
    //   //   $group: { _id: null, array: { $push: '$_id' } },
    //   // },

    //   // {
    //   //   $project: { array: true, _id: false },
    //   // },
    // ]);

    const products = await this.product.find({
      _id: { $in: newIds },
    });
    console.log('products', products.length);

    await Promise.all(
      products.map(async (el) => {
        await this.notificationService.sendNotification({
          title: `${el.discount}%off - ${el.productName}`,
          body: 'New Super Deals Added',
          imageUrl: `${this.configService.get('BASE_IMAGE_URL')}/${
            el.productImage
          }`,
          data: {
            productName: el.productName,
            _id: el._id.toString(),
            type: 'Product',
          } as any,
        });
      }),
    );
    // await sendNot
  }
  //
}

const productQuery = ({ productName }: ProductQueryDto) => {
  return (
    productName && {
      productName: { $regex: productName, $options: 'i' },
    }
  );
};
