import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  NotificationToken,
  NotificationTokenSchema,
} from 'src/app-apis/shcema/notificationToken.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: NotificationToken.name, schema: NotificationTokenSchema },
    ]),
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
