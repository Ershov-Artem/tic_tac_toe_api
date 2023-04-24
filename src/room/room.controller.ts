import { Controller, Param, Post } from '@nestjs/common';
import {Room} from './room.entity';
import { RoomService } from './room.service';

@Controller('room')
export class RoomController {
    constructor(private readonly roomService: RoomService) {}

    @Post()
    async createRoom(): Promise<Room> {
        return await this.roomService.createRoom()
    }
}