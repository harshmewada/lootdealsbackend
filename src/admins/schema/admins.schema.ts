import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ROLES } from 'src/constants';

export type AdminDocument = HydratedDocument<Admin>;

@Schema({ timestamps: true })
export class Admin {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop({ enum: ROLES })
  role: string;

  @Prop()
  password: string;

  @Prop()
  createdBy: string;

  @Prop()
  permissions: string[];
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
