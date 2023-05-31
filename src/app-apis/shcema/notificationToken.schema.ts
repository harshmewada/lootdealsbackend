import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type NotificationTokenDocument = HydratedDocument<NotificationToken>;

@Schema({ timestamps: true })
export class NotificationToken {
  @Prop({ unique: true })
  token: string;

  @Prop()
  createdBy: string;
}

export const NotificationTokenSchema =
  SchemaFactory.createForClass(NotificationToken);
