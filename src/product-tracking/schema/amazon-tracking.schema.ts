import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Category } from 'src/category/schema/category.schema';
import { Product } from 'src/products/schema/product.schema';
export type AmazonTrackingDocument = HydratedDocument<AmazonTracking>;

@Schema({ timestamps: true })
export class AmazonTracking {
  @Prop({ required: true })
  notificationToken: string;

  @Prop([
    {
      required: false,
      type: String,
    },
  ])
  products: string;

  @Prop([
    {
      required: false,
      type: mongoose.Schema.Types.ObjectId,
      ref: Category.name,
    },
  ])
  categories: Category[];
}

export const AmazonTrackingSchema =
  SchemaFactory.createForClass(AmazonTracking);
