import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import Redis from 'ioredis';
import { RedisKeys } from 'src/config/redis.config';
import { REDIS_CLIENT } from 'src/modules/redis/redis.module';

@Injectable()
export class RateLimiterMiddleware implements NestMiddleware {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const rawIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const ip = rawIp === '::1' ? '127.0.0.1' : rawIp;

    const key = RedisKeys.RATE_LIMIT_KEY_PREFIX + ip;

    const results = await this.redis
      .multi()
      .incr(key)
      .expire(key, 60, 'NX')
      .exec();

    if (results === null) {
      return res.status(500).send('Internal server error');
    }

    const curr = results[0][1] as number;

    if (curr > 10) {
      return res
        .status(429)
        .send('Max amount of request per ip address per minute is 10');
    }
    next();
  }
}
