import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'service is working and kirill is pidor :)';
  }
}
