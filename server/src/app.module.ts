import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisModule } from './modules/redis/redis.module';
import { RateLimiterMiddleware } from './middlewares';
import { RecentActivityMiddleware } from './middlewares/recent-activity.middleware';

@Module({
  imports: [RedisModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RateLimiterMiddleware, RecentActivityMiddleware)
      .forRoutes('*');
  }
}
