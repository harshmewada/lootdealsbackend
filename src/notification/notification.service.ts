import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import admin from 'firebase-admin';
import { Model } from 'mongoose';
import { NotificationToken } from 'src/app-apis/shcema/notificationToken.schema';
import { NotificationPayloadDto } from './dto/notification.dto';
const serviceAccount = require('../../config/firebase.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(NotificationToken.name)
    private notificationToken: Model<NotificationToken>,
  ) {}
  async sendNotification(data: NotificationPayloadDto) {
    const tokens = await await this.notificationToken.distinct('token');
    // .map((el) => el.token);
    const { title, body, imageUrl, data: notiData } = data;
    console.log('imageUrl', imageUrl);

    console.log(imageUrl);
    try {
      const send = await admin
        .messaging()
        .sendEachForMulticast({
          notification: {
            title,
            body,
            imageUrl,
          },
          tokens: tokens,
          data: notiData as any,
        })
        .then((Res) => {
          console.log('send res', Res);
        })
        .catch((err) => {
          console.log('sent err', err);
        });
    } catch (error) {
      console.log('notification send error', error);
    }
  }
}
