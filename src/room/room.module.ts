import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import {RedisModule} from '../redis/redis.module'
import { RedisService } from 'src/redis/redis.service';
import { RoomController } from './room.controller';
import { RoomGateway } from './room.gateway';
import { RoomGatewayService } from './room.gateway.service';

@Module({
    providers: [RoomService, RedisService, RoomGatewayService, RoomGateway],
    imports: [RedisModule],
    controllers: [RoomController]
})
export class RoomModule {}
