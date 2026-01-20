import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import Redis from 'ioredis';
import { REDIS_CLIENT } from 'src/modules/redis/redis.module';

export const RECENT_ACTIVITY_KEY_PREFIX = 'recent:activity';

@Injectable()
export class RecentActivityMiddleware implements NestMiddleware {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const payload = {
      timestamp: Date.now(),
      path: req.path,
    };

    try {
      this.redis
        .pipeline()
        .lpush(RECENT_ACTIVITY_KEY_PREFIX, JSON.stringify(payload))
        .ltrim(RECENT_ACTIVITY_KEY_PREFIX, 0, 49)
        .exec();
    } catch (error) {
      console.error('Failed to log recent activity:', error);
    }

    next();
  }
}
