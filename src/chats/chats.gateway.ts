import { Socket } from 'socket.io';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ChatsModel } from './models/chats.model';
import { Model } from 'mongoose';
import { SocketsModel } from './models/sockets.model';

@WebSocketGateway({ namespace: '/chattings' })
export class ChatsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger = new Logger('chat');

  constructor(
    @InjectModel(ChatsModel.name) private readonly chatModel: Model<ChatsModel>,
    @InjectModel(SocketsModel.name)
    private readonly socketModel: Model<SocketsModel>,
  ) {}

  //최초실행(초기화)
  afterInit() {
    this.logger.log('init...');
  }
  //소켓 연결시
  handleConnection(@ConnectedSocket() socket: Socket) {
    //nsp(namespace)
    this.logger.log(`connected: ${socket.id}, ${socket.nsp.name}`);
  }
  //소켓 종료시
  async handleDisconnect(@ConnectedSocket() socket: Socket) {
    const user = await this.socketModel.findOne({ socketId: socket.id });
    if (user) {
      socket.broadcast.emit('disconnect_user', user.username);
      await user.delete();
    }
    this.logger.log(`disconnected: ${socket.id}, ${socket.nsp.name}`);
  }

  @SubscribeMessage('new_user')
  async handleNewUser(
    @MessageBody() username: string,
    @ConnectedSocket() socket: Socket,
  ) {
    //exist 해당하는 필드에 데이터가 있는지 확인해줌
    const exist = await this.socketModel.exists({ username });
    if (exist) {
      username = `${username}_${Math.random() * 100}`;
      await this.socketModel.create({
        id: socket.id,
        username,
      });
    } else {
      await this.socketModel.create({
        id: socket.id,
        username,
      });
    }
    socket.broadcast.emit('user_connected', username);
    return username;
  }

  @SubscribeMessage('submit_chat')
  async handleSubmitChat(
    @MessageBody() chat: string,
    @ConnectedSocket() socket: Socket,
  ) {
    const socketObj = await this.socketModel.findOne({ socketId: socket.id });

    await this.chatModel.create({
      user: socketObj,
      chat,
    });

    socket.broadcast.emit('new_chat', {
      chat,
      username: socketObj.username,
    });
  }
}
