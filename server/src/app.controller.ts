import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { REDIS_CLIENT } from './redis/redis.module';
import Redis from 'ioredis';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
  ) {}

  @Get()
  async getHello(): Promise<string> {
    const response = await this.redis.ping();
    if (response === 'PONG') console.log('Redis works');
    return this.appService.getHello();
  }
}
