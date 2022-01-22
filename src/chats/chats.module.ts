import { Module } from '@nestjs/common';
import { ChatsGateway } from './chats.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatsModel, ChatsSchema } from './models/chats.model';
import { SocketsModel, SocketsSchema } from './models/sockets.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ChatsModel.name,
        schema: ChatsSchema,
      },
      {
        name: SocketsModel.name,
        schema: SocketsSchema,
      },
    ]),
  ],
  providers: [ChatsGateway],
})
export class ChatsModule {}
