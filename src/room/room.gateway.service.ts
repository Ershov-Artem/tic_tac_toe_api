import { Injectable } from '@nestjs/common';
import { ChangeMapDto, EnterRoomDto, Value } from './room.gateway.entity';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';
import { Room, Player } from './room.entity';

@Injectable()
export class RoomGatewayService {
    getToken(data: EnterRoomDto): string {
        return jwt.sign(data, process.env.JWT_SECRET_KEY || 'test')
    }

    verifyToken(token: string): EnterRoomDto {
        return jwt.verify(token, process.env.JWT_SECRET_KEY || 'test') as EnterRoomDto
    }

    async addPlayer(authData: EnterRoomDto): Promise<Room> {
        const [room] = await Room.find(authData.code)
        if (room.players.length < 2) {
            const newPlayer = new Player(authData.name, room.players.length + 1)
            room.players.push(newPlayer)
            console.log(room.turn)
            return (await room.save())[0]
        } else {
            throw new WsException('full party, kirill nowol-l Ha xuu"')
        }
    }

    async deletePlayer(authData: EnterRoomDto) {
        const [room] = await Room.find(authData.code)
        console.log(room.players)
        room.players = room.players.filter((p, _, __) => p.name != authData.name)
        console.log(room.players)
        if (room.players.length == 0){
            await room.delete()
        } else {
            await room.save()
        }
    }

    async changeMap(authData: EnterRoomDto, change: ChangeMapDto): Promise<[Room, Player]> {
        const [room] = await Room.find(authData.code)

        console.log(room)

        if (room.players[room.turn].name != authData.name) {
            throw new WsException('not your turn kirill pidor :(')
        }

        if (room.currentState[change.position] != Value.NOTHING) {
            throw new WsException('wrong position')
        }

        if (room.winner) {
            throw new WsException('already finished, blayt u nas uzhe est winner')
        }

        room.currentState[change.position] = room.players.find((p, _, __) => p.name == authData.name).sign

        const winnerSign = this.checkWinner(room.currentState)

        let winner = null
        if (winnerSign) {
            winner = room.players.find((p, _, __) => p.sign == winnerSign)
            room.winner = room.players.indexOf(winner)
        }

        room.turn = 1 - room.turn
        await room.save()
        return [room, winner]
    }

    async requestRevenge(authData: EnterRoomDto): Promise<boolean> {
        const [room] = await Room.find(authData.code)
        room.players.find((p, _, __) => p.name == authData.name).wantsRevenge = true
        await room.save()
        return room.players.every((p, _, __) => p.wantsRevenge)
    }

    async resetRoom(authData: EnterRoomDto): Promise<Room> {
        const [room] = await Room.find(authData.code)

        room.currentState = [0, 0, 0,
                             0, 0, 0,
                             0, 0, 0]
        for (const player of room.players) {
            player.sign = 3 - player.sign
            player.wantsRevenge = false
        }

        return (await room.save())[0]
    }

    private checkWinner(map: number[]): number | null {
        const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]
        for (const win of wins) {
            let sign = null
            let gotWinner = true
            for (const i of win) {
                sign = sign || map[i]
                if (sign != map[i]) {
                    gotWinner = false
                    break
                }
            }
            if (gotWinner) return sign
        }
        return null
    }
}
