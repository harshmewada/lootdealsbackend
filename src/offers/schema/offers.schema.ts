import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type OfferDocument = HydratedDocument<Offer>;

@Schema({ timestamps: true })
export class Offer {
  @Prop()
  offerName: string;

  @Prop()
  offerImage: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  createdBy: string;
}

export const OfferSchema = SchemaFactory.createForClass(Offer);
