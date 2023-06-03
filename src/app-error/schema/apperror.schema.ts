import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { AppErrorQueryDto } from '../dto/apperror.dto';

export type AppErrorDocument = HydratedDocument<AppError>;

@Schema({ timestamps: true })
export class AppError {
  @Prop()
  error: string;

  @Prop()
  message: string;

  @Prop()
  errorName: string;

  @Prop()
  brand: string;

  @Prop()
  buildNumber: string;

  @Prop()
  device: string;

  @Prop()
  deviceName: string;

  @Prop()
  os: string;

  @Prop()
  createdBy: string;
}

export const AppErrorSchema = SchemaFactory.createForClass(AppError);
