import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisModule } from './modules/redis/redis.module';
import { RateLimiterMiddleware, RecentActivityMiddleware } from './middlewares';
import { LogsModule } from './modules/logs/logs.module';
import { DatabaseModule } from './modules/database/database.module';

@Module({
  imports: [RedisModule, LogsModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RateLimiterMiddleware, RecentActivityMiddleware)
      .forRoutes('*path');
  }
}
