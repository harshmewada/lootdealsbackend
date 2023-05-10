import {
  Processor,
  Process,
  InjectQueue,
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  OnQueueWaiting,
  OnQueueError,
} from '@nestjs/bull';
import {
  BeforeApplicationShutdown,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Job, Queue } from 'bull';
import { ProductsService } from 'src/products/products.service';
const cronRepeatOptions = (cronTime: string) => {
  return {
    repeat: {
      cron: cronTime,
    },
  };
};
@Processor('queue')
export class QueueConsumer
  implements BeforeApplicationShutdown, OnApplicationBootstrap
{
  constructor(
    @InjectQueue('queue') private queue: Queue,
    private configService: ConfigService,
    private productService: ProductsService,
  ) {}

  onApplicationBootstrap() {
    const duration = this.configService.get('PRICE_CRON_INTERVAL');

    this.queue.add('price', {}, cronRepeatOptions(duration));
  }
  beforeApplicationShutdown(signal?: string) {
    console.log('end');
  }

  @Process('price')
  async transcode(job: Job<unknown>) {
    await this.productService.priceCheckForLast24hour();

    return {};
  }

  @OnQueueActive()
  async onActive() {
    // job: Job
    const waitingCount = await this.queue.getJobCounts();
    // console.log(
    //   `Processing job ${job.id} of type ${job.name} with data `,
    //   job.data.type,
    // );
    console.log(`Jobs Status - `, waitingCount);
  }

  @OnQueueError()
  handler(error: Error) {
    console.log(`job error `, error);
  }

  @OnQueueWaiting()
  async jobWaiting(jobId: number | string) {
    console.log(`job waitings `, jobId);
  }

  @OnQueueCompleted()
  jobCompleted(
    job: Job,
    // result: any
  ) {
    console.log(`job completed `, job.name, job.id);
  }

  @OnQueueFailed()
  jobFailed(job: Job, err: Error) {
    console.log(`job Faield `, job.name, err);
  }
}
