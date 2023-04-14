import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ROLES } from 'src/constants';

export type PlatformDocument = HydratedDocument<Platform>;

@Schema({ timestamps: true })
export class Platform {
  @Prop()
  platformName: string;

  @Prop()
  platformImage: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  createdBy: string;
}

export const PlatformSchema = SchemaFactory.createForClass(Platform);
