import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({ timestamps: true })
export class Category {
  @Prop()
  categoryName: string;

  @Prop({ default: true })
  enableNotification: boolean;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  createdBy: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
