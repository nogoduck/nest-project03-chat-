import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaOptions, Types, Document } from 'mongoose';
import { IsNotEmpty, IsString } from 'class-validator';
import { SocketsModel } from './sockets.model';

const options: SchemaOptions = {
  collection: 'chattings',
  timestamps: true,
};

@Schema(options)
export class ChatsModel extends Document {
  @Prop({
    type: {
      _id: { type: Types.ObjectId, required: true, ref: 'sockets' },
      socketId: { type: String },
      username: { type: String, required: true },
    },
  })
  @IsNotEmpty()
  @IsString()
  user: SocketsModel;

  @Prop({ required: true })
  @IsNotEmpty()
  @IsString()
  chat: string;
}

export const ChatsSchema = SchemaFactory.createForClass(ChatsModel);
