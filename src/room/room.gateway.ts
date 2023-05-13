import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WsException } from "@nestjs/websockets";
import { EnterRoomDto } from "./room.gateway.entity";
import { RoomGatewayService } from "./room.gateway.service";
import { Socket } from 'socket.io';
import { Room } from "./room.entity";

@WebSocketGateway({ 
    // path: '/ws',
    cors: true
 })
export class RoomGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(private readonly roomGatewayService: RoomGatewayService) {}

    async handleConnection(client: Socket, ...args: any[]) {

        console.log(client.handshake.query);
        
        const code = parseInt(client.handshake.query.code as string)
        const name = client.handshake.query.name as string

        let roomState: Room
        try{
            roomState = await this.roomGatewayService.addPlayer({code: code, name: name})
        } catch(e) {
            client.emit('message', e.message)
            return
        }
        client.join(`${code}`)

        client.emit('token', JSON.stringify(
            {token: this.roomGatewayService.getToken({code: code, name: name})}
        ))
        client.emit('roomState', JSON.stringify(roomState))
        client.in(`${code}`).emit('roomState', JSON.stringify(roomState))
    }

    async handleDisconnect(client: Socket, ...args: any[]) {
        const code = parseInt(client.handshake.query.code as string)
        const name = client.handshake.query.name as string

        client.in(`${code}`).emit('disconnected', JSON.stringify({message: "Partner disconnected"}))
        client.leave(`${code}`)
        await this.roomGatewayService.deletePlayer({code: code, name: name})
    }

    @SubscribeMessage('changeMap')
    async handleChangeMapEvent(@MessageBody() rawChange: string, @ConnectedSocket() clientSocket: Socket) {
        const change = JSON.parse(rawChange)
        console.log(change.token)
        
        let authData: EnterRoomDto

        try {
            authData = this.roomGatewayService.verifyToken(change.token)

            const [roomState, winner] = await this.roomGatewayService.changeMap(authData, change)
            console.log(roomState)

            clientSocket.in(`${authData.code}`).emit('roomState', JSON.stringify(roomState))
            clientSocket.emit('roomState', JSON.stringify(roomState))

            if (winner) {
                clientSocket.in(`${authData.code}`).emit('lose', JSON.stringify({ winner: winner }))
                clientSocket.emit('win', JSON.stringify({ winner: winner }))
            }
        } catch (error) {
            console.log(error);
            
            clientSocket.emit('message', error.message)
        }

    }

    @SubscribeMessage('revengeRequest')
    async handleRevengeRequestEvent(@MessageBody() rawData: string, @ConnectedSocket() clientSocket: Socket) {
        const data = JSON.parse(rawData)
        console.log(data.token)
        
        let authData: EnterRoomDto

        try {
            authData = this.roomGatewayService.verifyToken(data.token)

            const accepted = await this.roomGatewayService.requestRevenge(authData)
            if (!accepted) {
                clientSocket.in(`${authData.code}`).emit('revengeRequest')
            } else {
                const roomState = await this.roomGatewayService.resetRoom(authData)
                clientSocket.in(`${authData.code}`).emit('revenge')
                clientSocket.emit('revenge')
                clientSocket.in(`${authData.code}`).emit('roomState', JSON.stringify(roomState))
                clientSocket.emit('roomState', JSON.stringify(roomState))
            }
        } catch (error) {
            console.log(error);
            
            clientSocket.emit('message', error.message)
        }

    }
}