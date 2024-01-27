import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { MONGO_DEFAULT_SCHEMA_OPTIONS } from 'src/shared/constants';

export type UserDocument = HydratedDocument<User>;

const SCHEMA_OPTIONS = {
  ...MONGO_DEFAULT_SCHEMA_OPTIONS,
  collection: 'users',
};

@Schema(SCHEMA_OPTIONS)
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  middleName?: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  birthDate: string;

  @Prop({ required: true })
  status: string;

  @Prop({ required: false })
  lastSessionAt: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
