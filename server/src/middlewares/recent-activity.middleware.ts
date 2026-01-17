import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import Redis from 'ioredis';
import { REDIS_CLIENT } from 'src/modules/redis/redis.module';

export const RECENT_ACTIVITY_KEY_PREFIX = '::';

@Injectable()
export class RecentActivityMiddleware implements NestMiddleware {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  async use(req: Request, res: Response, next: NextFunction) {
    next();
  }
}
