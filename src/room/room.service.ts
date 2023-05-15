import { Injectable } from '@nestjs/common';
import { Room } from './room.entity';

@Injectable()
export class RoomService {
    private generateCode(): number {
        return Math.floor(1000 + Math.random() * 8999)
    }

    async createRoom(): Promise<Room> {
        let code = this.generateCode()
        while ((await Room.find(code))[0]) {
            code = this.generateCode()
        }

        const newRoom = new Room(code)
        newRoom.turn = 1
        return await newRoom.save()[0]
    }
}
