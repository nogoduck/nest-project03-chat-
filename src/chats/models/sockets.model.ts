import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaOptions, Document } from 'mongoose';
import { IsNotEmpty, IsString } from 'class-validator';

//options에 id는 기본적으로 true값을 가지는데 그렇게되면 몽구스에서 기본적으로 생성해주는
//'_id' 와 사용자가 생성한 'id'가 동일하게 생성된다
//false를 두면 서로 다르게 동작한다.
const options: SchemaOptions = {
  id: false,
  collection: 'sockets',
  timestamps: true,
};

@Schema(options)
export class SocketsModel extends Document {
  @Prop({
    unique: true,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  id: string;

  @Prop({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  username: string;
}

export const SocketsSchema = SchemaFactory.createForClass(SocketsModel);
