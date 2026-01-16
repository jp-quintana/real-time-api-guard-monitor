import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import Redis from 'ioredis';
import { REDIS_CLIENT } from 'src/modules/redis/redis.module';

export const RATE_LIMIT_KEY_PREFIX = 'rate:ip:';

@Injectable()
export class RateLimiterMiddleware implements NestMiddleware {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const rawIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const ip = rawIp === '::1' ? '127.0.0.1' : rawIp;

    const key = RATE_LIMIT_KEY_PREFIX + ip;

    const curr = await this.redis.incr(key);

    if (curr === 1) {
      await this.redis.expire(key, 60);
    } else if (curr > 10) {
      return res
        .status(429)
        .send('Max amount of request per ip address per minute is 10 ');
    }
    next();
  }
}
