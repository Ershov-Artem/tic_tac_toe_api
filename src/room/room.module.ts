import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { RoomGateway } from './room.gateway';
import { RoomGatewayService } from './room.gateway.service';

@Module({
    providers: [RoomService, RoomGatewayService, RoomGateway],
    imports: [],
    controllers: [RoomController]
})
export class RoomModule {}
