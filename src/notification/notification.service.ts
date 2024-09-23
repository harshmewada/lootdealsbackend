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
}
