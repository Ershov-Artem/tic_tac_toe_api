import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service'
import { ChangeMapDto, EnterRoomDto, Value } from './room.gateway.entity';
import { WsException } from '@nestjs/websockets';
import { Redis } from 'ioredis';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class RoomGatewayService {
    constructor(private readonly redisService: RedisService) {
        this.redisClient = this.redisService.getRedis()
    }

    private redisClient: Redis

    getToken(data: EnterRoomDto): string {
        return jwt.sign(data, process.env.JWT_SECRET_KEY || 'test')
    }

    verifyToken(token: string): EnterRoomDto {
        return jwt.verify(token, process.env.JWT_SECRET_KEY || 'test') as EnterRoomDto
    }

    async addPlayer (authData: EnterRoomDto ) {
        if (!await this.redisClient.get(`room.${authData.code}.player1`)){
            await this.redisClient.set(`room.${authData.code}.player1`, authData.name)
        } 

        else if (!await this.redisClient.get(`room.${authData.code}.player2`)){
            await this.redisClient.set(`room.${authData.code}.player2`, authData.name)
        }
    }

    async changeMap(authData: EnterRoomDto, change: ChangeMapDto): Promise<number[]> {
        if (!await this.validateMapChange(authData, change)) throw new WsException('wrong position')
        await this.redisClient.lset(`room.${authData.code}.map`, change.position, change.sign)
        return (await this.redisClient.lrange(`room.${authData.code}.map`, 0, -1)).map((e) => parseInt(e))
    }

    private async validateMapChange(authData: EnterRoomDto, change: ChangeMapDto): Promise<boolean> {
        if (await this.redisClient.get(`room.${authData.code}`) != 'exists') return false
        if (await this.redisClient.get(`room.${authData.code}.player1`) != authData.name &&
            await this.redisClient.get(`room.${authData.code}.player2`) != authData.name) return false
        if (parseInt(
            await this.redisClient
                .lindex(`room.${authData.code}.map`, change.position)
        ) != Value.NOTHING) return false
        return true
    }
}
