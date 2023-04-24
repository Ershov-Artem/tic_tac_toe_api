import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoomModule } from './room/room.module';
import { RoomService } from './room/room.service';
import { RedisModule } from './redis/redis.module';
import { RedisService } from './redis/redis.service';

@Module({
  imports: [
    RoomModule,
    RedisModule
  ],
  controllers: [AppController],
  providers: [AppService, RoomService, RedisService],
})
export class AppModule {}
