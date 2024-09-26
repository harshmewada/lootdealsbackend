import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import admin from 'firebase-admin';
import { Model } from 'mongoose';
import { NotificationToken } from 'src/app-apis/shcema/notificationToken.schema';
import { NotificationPayloadDto } from './dto/notification.dto';
import { AmazonTracking } from 'src/product-tracking/schema/amazon-tracking.schema';
import { ProductDocument } from 'src/products/schema/product.schema';
import { AgendaService } from '@agent-ly/nestjs-agenda';
import { NOTIFICATIONACTIONS } from 'src/constants';
const serviceAccount = require('../../config/firebase.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(NotificationToken.name)
    private notificationToken: Model<NotificationToken>,

    @InjectModel(AmazonTracking.name)
    private amazonTracking: Model<AmazonTracking>,

    private readonly agendaService: AgendaService,
  ) {}

  async sendNotification(data: NotificationPayloadDto) {
    const tokens = await this.notificationToken.distinct('token');

    const max = 500;

    const empties = new Array(Math.ceil(tokens.length / max));

    const dividedArrs = empties.fill('_').map((i) => tokens.splice(0, max));

    const { title, body, imageUrl, data: notiData } = data;
    console.log('imageUrl', imageUrl);

    for (const arr of dividedArrs) {
      try {
        const send = await admin
          .messaging()
          .sendEachForMulticast({
            notification: {
              title,
              body,
              imageUrl,
            },
            tokens: arr,
            data: notiData as any,
          })
          .then((Res) => {
            console.log('send res', Res);
            Res.responses.map((el) => {
              if (el.error) {
                console.log('notification err', el.error);
              }
            });
          })
          .catch((err) => {
            console.log('sent err', err);
          });
      } catch (error) {
        console.log('notification send error', error);
      }
    }
    // .map((el) => el.token);
  }

  async sendSelectedCategoryNotifications(
    categoryIds: string[],
    product: ProductDocument,
  ) {
    // console.log('categoryIds', categoryIds, product);
    const findCategoryTokens = await this.amazonTracking.aggregate([
      { $unwind: '$categories' },

      {
        $addFields: {
          categoryId: { $toString: '$categories' },
        },
      },
      {
        $lookup: {
          from: 'categories',
          let: {
            debuggercategoryId: '$categoryId',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', { $toObjectId: '$$debuggercategoryId' }],
                },
              },
            },
          ],
          as: 'category',
        },
      },
      { $unwind: '$category' },
      {
        $match: {
          $expr: { $in: ['$categoryId', categoryIds] },
        },
      },
      {
        $group: {
          _id: '',
          categories: {
            $addToSet: {
              categoryId: '$categoryId',
              categoryName: '$category.categoryName',
            },
          },
          tokens: { $addToSet: '$notificationToken' },
        },
      },
    ]);
    if (findCategoryTokens[0]) {
      const data = findCategoryTokens[0].tokens;
      if (data)
        // await this.sendCategoryNotification
        // console.log('findCategoryTokens', findCategoryTokens);
        this.agendaService.now(
          NOTIFICATIONACTIONS.SEND_TO_SUBSCRIBED_CATEGORIES,
          { tokens: data, product },
        );
    }
  }

  async intervalProductTrackingData() {
    const productData = await this.amazonTracking.aggregate([
      { $match: { $expr: { $gt: [{ $size: '$products' }, 0] } } },
    ]);
    productData.forEach((e) =>
      this.agendaService.now(NOTIFICATIONACTIONS.CHECK_MY_PRODUCT_PRICE, e),
    );
  }
}
