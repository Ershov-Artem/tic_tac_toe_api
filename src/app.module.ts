import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoomModule } from './room/room.module';
import { RoomService } from './room/room.service';

@Module({
  imports: [
    RoomModule,
  ],
  controllers: [AppController],
  providers: [AppService, RoomService],
})
export class AppModule {}
