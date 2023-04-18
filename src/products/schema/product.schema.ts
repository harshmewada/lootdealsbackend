import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Category } from 'src/category/schema/category.schema';
import { Platform } from 'src/platforms/schema/platforms.schema';

export type ProductDocument = mongoose.HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {
  @Prop()
  productName: string;

  @Prop()
  productImage: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Platform.name })
  platformId: mongoose.Schema.Types.ObjectId;

  @Prop()
  platformName: string;

  @Prop()
  productUrl: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Category.name })
  categoryId: mongoose.Schema.Types.ObjectId;

  // @Prop()
  // categoryName: string;

  @Prop()
  mrpPrice: string;

  @Prop()
  sellPrice: string;

  @Prop()
  discount: string;

  @Prop({ default: false })
  isExpired: boolean;

  @Prop({ default: false })
  isAutoAdded: boolean;

  @Prop({ default: 0 })
  viewCount: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  createdBy: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
