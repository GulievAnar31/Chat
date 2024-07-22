import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io'
import { AppService } from 'src/app.service';

@WebSocketGateway()
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(private appService: AppService){}

  @WebSocketServer() server: Server; 

  @SubscribeMessage('sendMessage')
  async handleSendMessage(client: any, payload: any): Promise<void> {
    await this.appService.createMessage(payload)
    this.server.emit('recMessage', payload);
  }

  afterInit(server: any) {
      console.log(server);
  }

  handleConnection(client: any) {
      console.log(`Connected ${client.id}`)
  }

  handleDisconnect(client: any) {
    console.log(`Disconnected ${client.id}`)
  }
}
