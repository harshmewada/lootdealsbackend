import { Processor, InjectQueue, WorkerHost } from '@nestjs/bullmq';
import { forwardRef, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Job, Queue } from 'bullmq';
import { NOTIFICATIONACTIONS } from 'src/constants';
import { AmazonTrackingDocument } from 'src/product-tracking/schema/amazon-tracking.schema';
import { ProductsService } from 'src/products/products.service';
import admin from 'firebase-admin';
import { ISendNotificationPayload } from './dto/notification.dto';
import { ProductDocument } from 'src/products/schema/product.schema';
const cronRepeatOptions = (cronTime: string) => {
  return {
    repeat: {
      cron: cronTime,
    },
  };
};

interface SendNotificationToSubscribedCategories {
  tokens: string[];
  product: ProductDocument;
}
@Processor(NOTIFICATIONACTIONS.CHECK_MY_PRODUCT_PRICE)
export class ProductPriceCheckProcessor extends WorkerHost {
  constructor(
    @Inject(forwardRef(() => ProductsService))
    private readonly productService: ProductsService,
  ) {
    super();
  }

  async process(job: Job<AmazonTrackingDocument>) {
    console.log('CHECK_MY_PRODUCT_PRICE');
    this.productService.checkMyProductPriceDifference(job.data);
  }
}

@Processor(NOTIFICATIONACTIONS.SEND_PRODUCT_NOTIFICATION, { concurrency: 1 })
export class SendNotificationProcessor extends WorkerHost {
  constructor(
    @InjectQueue(NOTIFICATIONACTIONS.SEND_FIREBASE_NOTIFICATION)
    private readonly firebaseNotification: Queue,
  ) {
    super();
  }

  async process(job: Job<ISendNotificationPayload>) {
    const { title, body, imageUrl, tokens, data } = job.data;
    const splitArr = splitTokensArr(job.data.tokens);
    console.log('splitArr', splitArr.length);
    splitArr.forEach(
      (e, eI) =>
        this.firebaseNotification.add(
          NOTIFICATIONACTIONS.SEND_FIREBASE_NOTIFICATION,
          {
            ...job.data,
            tokens: e,
          },
        ),
      // admin
      //   .messaging()
      //   .sendEachForMulticast({
      //     notification: {
      //       title,
      //       body,
      //       imageUrl,
      //     },
      //     tokens: e,
      //     data: data as any,
      //   })
      //   .then((Res) => {
      //     Res.responses.map((el) => {
      //       if (el.error) {
      //         console.log('noti send error ', el.error);
      //       }
      //     });
      //   })
      //   .catch((err) => {
      //     console.log('noti send error', err);
      //   }),
    );
  }
}

@Processor(NOTIFICATIONACTIONS.SEND_FIREBASE_NOTIFICATION, { concurrency: 20 })
export class FirebaseNotificationProcessor extends WorkerHost {
  async process(job: Job<ISendNotificationPayload>) {
    const { title, body, imageUrl, tokens, data } = job.data;
    console.log('tokens', tokens.length);
    const firebaseNotiResponse = await admin.messaging().sendEachForMulticast({
      notification: {
        title,
        body,
        imageUrl,
      },
      tokens: tokens,
      data: data as any,
    });

    console.log('firebaseNotiResponse', {
      jobId: job.token,
      success: firebaseNotiResponse.successCount,
      failure: firebaseNotiResponse.failureCount,
    });
  }
}

@Processor(NOTIFICATIONACTIONS.SEND_TO_SUBSCRIBED_CATEGORIES)
export class SubscribedCategoriesNotificationProcessor extends WorkerHost {
  constructor(
    @Inject(forwardRef(() => ProductsService))
    private readonly productService: ProductsService,
    @InjectQueue(NOTIFICATIONACTIONS.SEND_PRODUCT_NOTIFICATION)
    private notificationQueue: Queue,

    private readonly configService: ConfigService,
  ) {
    super();
  }

  async process(job: Job<SendNotificationToSubscribedCategories>) {
    // const splitArr = splitTokensArr(job.attrs.data.tokens);
    // splitArr.forEach((e) => {
    const createdProduct = job.data.product;
    this.notificationQueue.add(NOTIFICATIONACTIONS.SEND_PRODUCT_NOTIFICATION, {
      title: `${createdProduct.discount}%off - ${createdProduct.productName}`,
      body: 'New Loot Deal Added',
      imageUrl: `${this.configService.get('BASE_IMAGE_URL')}/${
        createdProduct.productImage
      }`,
      data: {
        productName: createdProduct.productName,
        _id: createdProduct._id.toString(),
        type: 'Product',
      } as any,
      tokens: job.data.tokens,
    });
    // });

    // console.log('splitArr', splitArr);
  }
}

// import {
//   Processor,
//   Define,
//   Every,
//   Schedule,
//   AgendaService,
// } from '@agent-ly/nestjs-agenda';
// import { Job } from 'agenda';
// import { NOTIFICATIONACTIONS } from 'src/constants';
// import { ProductDocument } from 'src/products/schema/product.schema';
// import {
//   ISendNotificationPayload,
//   NotificationPayloadDto,
// } from './dto/notification.dto';
// import admin from 'firebase-admin';
// import { ConfigService } from '@nestjs/config';
// import { ProductTrackingService } from 'src/product-tracking/product-tracking.service';
// import { NotificationService } from './notification.service';
// import { AmazonTrackingDocument } from 'src/product-tracking/schema/amazon-tracking.schema';
// import { ProductsService } from 'src/products/products.service';

// interface ISayYourName {
//   name: string;
// }
// interface SendNotificationToSubscribedCategories {
//   tokens: string[];
//   product: ProductDocument;
// }

// @Processor()
// export class NotificationProcessor {
//   constructor(
//     private readonly agendaService: AgendaService,
//     private readonly configService: ConfigService,
//     private readonly productService: ProductsService,

//     private readonly notificationService: NotificationService,
//   ) {}
//   getInterval() {
//     return this.configService.get('PRICE_DROP_CHECK_INTERVAL') || '10 minutes';
//   }
//   @Define('Say "Hello world!"')
//   @Every('30 minutes')
//   sayHelloWorld() {
//     this.notificationService.intervalProductTrackingData();
//   }

//   @Define(NOTIFICATIONACTIONS.CHECK_MY_PRODUCT_PRICE)
//   checkMyProductPrice(job: Job<AmazonTrackingDocument>) {
//     this.productService.checkMyProductPriceDifference(job.attrs.data);
//     job.remove();
//   }

//   @Define(NOTIFICATIONACTIONS.SEND_PRODUCT_NOTIFICATION, {
//     concurrency: 1,
//   })
// sendProductNotification(job: Job<ISendNotificationPayload>) {
//   const { title, body, imageUrl, tokens, data } = job.attrs.data;
//   const splitArr = splitTokensArr(job.attrs.data.tokens);
//   splitArr.forEach((e) =>
//     admin
//       .messaging()
//       .sendEachForMulticast({
//         notification: {
//           title,
//           body,
//           imageUrl,
//         },
//         tokens: e,
//         data: data as any,
//       })
//       .then((Res) => {
//         // console.log('send res', Res);
//         Res.responses.map((el) => {
//           if (el.error) {
//             // console.log('notification err', el.error);
//           }
//         });
//       })
//       .catch((err) => {
//         // console.log('sent err', err);
//       }),
//   );
//   job.remove();

//   // console.log(`Your name is `, job.attrs.data);

//   // console.log('splitArr', splitArr);
// }

//   @Define(NOTIFICATIONACTIONS.SEND_PRODUCT_NOTIFICATION_TO_SINGLE_USER)
//   sendProductNotificationToSingleUser(job: Job<ISendNotificationPayload>) {
//     this.sendProductNotification(job);
//   }
//   @Define(NOTIFICATIONACTIONS.SEND_TO_SUBSCRIBED_CATEGORIES)
//   async sayYourName(job: Job<SendNotificationToSubscribedCategories>) {
//     // const splitArr = splitTokensArr(job.attrs.data.tokens);
//     // splitArr.forEach((e) => {
//     const createdProduct = job.attrs.data.product;
//     this.agendaService.now(NOTIFICATIONACTIONS.SEND_PRODUCT_NOTIFICATION, {
//       // title: 'A new product has Been added',
//       // body: `${job.attrs.data.product.productName}`,
//       // imageUrl: `${this.configService.get('BASE_IMAGE_URL')}/${
//       //   job.attrs.data.product.productImage
//       // }`,
//       // data: {
//       //   productName: job.attrs.data.product.productName,
//       //   _id: job.attrs.data.product._id.toString(),
//       //   type: 'Product',
//       // },
//       title: `${createdProduct.discount}%off - ${createdProduct.productName}`,
//       body: 'New Loot Deal Added',
//       imageUrl: `${this.configService.get('BASE_IMAGE_URL')}/${
//         createdProduct.productImage
//       }`,
//       data: {
//         productName: createdProduct.productName,
//         _id: createdProduct._id.toString(),
//         type: 'Product',
//       } as any,
//       tokens: job.attrs.data.tokens,
//     });
//     // });

//     await job.remove();

//     // console.log('splitArr', splitArr);
//   }
// }

const splitTokensArr = (tokens: string[]) => {
  const max = 500;

  const empties = new Array(Math.ceil(tokens.length / max));

  const dividedArrs = empties.fill('_').map((i) => tokens.splice(0, max));

  return dividedArrs;
};
