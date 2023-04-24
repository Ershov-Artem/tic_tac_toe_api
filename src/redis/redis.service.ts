import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
    private static redis: Redis;

    getRedis() {
        RedisService.redis = RedisService.redis || new Redis({
            host: process.env.REDIS_HOST || '127.0.0.1',
            port: parseInt(process.env.REDIS_PORT) || 6379
        })
        return RedisService.redis
    }
}
