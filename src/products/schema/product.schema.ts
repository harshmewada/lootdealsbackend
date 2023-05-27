import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
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

  @Prop()
  description: string;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: Category.name }])
  categoryId: mongoose.Schema.Types.ObjectId[];

  // @Prop()
  // categoryName: string;

  @Prop()
  basePrice: string;

  @Prop()
  salePrice: string;

  @Prop()
  discount: string;

  @Prop()
  amazonProductId: string;

  @Prop({ default: false })
  isExpired: boolean;

  @Prop({ default: false })
  isAutoAdded: boolean;

  @Prop({ default: 0 })
  viewCount: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isManyProducts: boolean;

  @Prop()
  createdBy: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
ProductSchema.index({ productName: 'text' }, { unique: true });
