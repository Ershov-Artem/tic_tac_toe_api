import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { ChangeMapDto, EnterRoomDto, Value } from "./room.gateway.entity";
import { RoomGatewayService } from "./room.gateway.service";
import { Socket } from 'socket.io';

@WebSocketGateway({ 
    // path: '/ws',
    cors: true
 })
export class RoomGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(private readonly roomGatewayService: RoomGatewayService) {}

    private connectedUsers: Map<number, Map<string, Socket>> = new Map()

    handleConnection(client: Socket, ...args: any[]) {
        console.log(client.handshake.query);
        
        const code = parseInt(client.handshake.query.code as string)
        const name = client.handshake.query.name as string

        this.connectedUsers.set(code, this.connectedUsers.get(code) || new Map())
        this.connectedUsers.get(code).set(name, client)

        this.roomGatewayService.addPlayer({code: code, name: name})

        client.emit('token', this.roomGatewayService.getToken({code: code, name: name}))
    }

    handleDisconnect(client: Socket, ...args: any[]) {
        const code = parseInt(client.handshake.query.code as string)
        const name = client.handshake.query.name as string

        this.connectedUsers.get(code).delete(name)
        if (this.connectedUsers.get(code).size == 0) this.connectedUsers.delete(code)
    }

    @SubscribeMessage('changeMap')
    async handleChangeMapEvent(@MessageBody() rawChange: string, @ConnectedSocket() clientSocket: Socket) {
        const change = JSON.parse(rawChange)
        console.log(change.token);
        
        let authData: EnterRoomDto

        try {
            authData = this.roomGatewayService.verifyToken(change.token)

            const changedMap = await this.roomGatewayService.changeMap(authData, change)
            console.log(changedMap)
                
            this.connectedUsers.get(authData.code).forEach((socket, player) => {
                console.log(player)
                socket.emit('changeMap', changedMap)
            })
    
        } catch (error) {
            console.log(error);
            
            return clientSocket.send({ error: error.toString() })
        }

    }
}