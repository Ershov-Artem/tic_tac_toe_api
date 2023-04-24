import { Injectable } from '@nestjs/common';
import { Room } from './room.entity';
import { RedisService } from '../redis/redis.service'

@Injectable()
export class RoomService {
    constructor(private readonly redisService: RedisService) {}

    generateCode(): number {
        return Math.floor(1000 + Math.random() * 8999)
    }

    async createRoom(): Promise<Room> {
        const client = this.redisService.getRedis()
        let code = this.generateCode()
        while (await client.get(`room.${code}`)) {
            code = this.generateCode() 
        }
        await client.set(`room.${code}`, 'exists')
        await client.lpush(`room.${code}.map`, 0,0,0,0,0,0,0,0,0)
        return new Room(code)
    }
}
