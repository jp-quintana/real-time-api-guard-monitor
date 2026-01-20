import Redis from 'ioredis';
import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RedisKeys } from 'src/config';
import { REDIS_CLIENT } from 'src/modules/redis/redis.module';
import { pack } from 'msgpackr';
import { RecentActivity } from 'src/modules/logs/interfaces/recent-activity.interface';

@Injectable()
export class RecentActivityMiddleware implements NestMiddleware {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  async use(req: Request, _res: Response, next: NextFunction) {
    const payload: RecentActivity = {
      timestamp: Date.now(),
      path: req.path,
    };

    this.redis
      .pipeline()
      .lpush(RedisKeys.RECENT_ACTIVITY_KEY, pack(payload))
      .ltrim(RedisKeys.RECENT_ACTIVITY_KEY, 0, 49)
      .exec()
      .catch((error) => console.error('Failed to log recent activity:', error));

    next();
  }
}
