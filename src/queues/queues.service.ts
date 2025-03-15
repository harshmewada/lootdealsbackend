import { InjectQueue } from '@nestjs/bullmq';
import {
  BeforeApplicationShutdown,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue } from 'bullmq';
import { NOTIFICATIONACTIONS } from 'src/constants';
import { ProductsService } from 'src/products/products.service';
const cronRepeatOptions = (cronTime: string) => {
  return {
    repeat: {
      cron: cronTime,
    },
  };
};
export class QueuesService
  implements BeforeApplicationShutdown, OnApplicationBootstrap
{
  constructor(
    @InjectQueue(NOTIFICATIONACTIONS.CHECK_MY_PRODUCT_PRICE)
    private readonly priceCheckQueue: Queue,
    private configService: ConfigService,
    private productService: ProductsService,
  ) {}
  async beforeApplicationShutdown(signal?: string) {}

  async onApplicationBootstrap() {
    const duration = this.configService.get('PRICE_CRON_INTERVAL');

    this.priceCheckQueue.add(
      NOTIFICATIONACTIONS.CHECK_MY_PRODUCT_PRICE,
      {},
      {
        repeat: {
          every: 10000,
        },
      },
    );
  }
}
