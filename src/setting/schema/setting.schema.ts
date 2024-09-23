import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type SettingDocument = HydratedDocument<Setting>;

@Schema({ timestamps: true })
export class Setting {
  @Prop({ default: '' })
  email: string;

  @Prop({ default: '' })
  telegramLink: string;

  @Prop()
  telegramBannerImage: string;

  @Prop({ default: '' })
  telegramBannerLink: string;

  @Prop({ default: '' })
  whatsappLink: string;

  @Prop({ default: '' })
  youtubeLink: string;

  @Prop({ default: '' })
  privacyLink: string;

  @Prop({ default: true })
  showAds: boolean;

  @Prop({ default: true })
  showTelegramBanner: boolean;

  @Prop({ default: false })
  showTracking: boolean;

  @Prop({ default: '' })
  trackingBannerImage: string;

  @Prop({ default: '' })
  trackingInstructions: string;
}

export const SettingSchema = SchemaFactory.createForClass(Setting);
