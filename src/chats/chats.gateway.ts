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

@WebSocketGateway({ namespace: '/chattings' })
export class ChatsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger = new Logger('chat');

  //최초실행
  afterInit() {
    this.logger.log('init...');
  }
  //소켓 연결시
  handleConnection(@ConnectedSocket() socket: Socket) {
    //nsp(namespace)
    this.logger.log(`connected: ${socket.id}, ${socket.nsp.name}`);
  }
  //소켓 종료시
  handleDisconnect(@ConnectedSocket() socket: Socket) {
    this.logger.log(`disconnected: ${socket.id}, ${socket.nsp.name}`);
  }

  @SubscribeMessage('new_user')
  handleNewUser(
    @MessageBody() username: string,
    @ConnectedSocket() socket: Socket,
  ): string {
    console.log('username >> ', username);
    console.log('socket.id >> ', socket.id);
    socket.emit('hello_user', `hello ${username}`);

    return 'hello socket';
  }
}
