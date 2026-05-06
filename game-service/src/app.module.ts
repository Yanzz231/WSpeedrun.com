import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtAuthModule } from './auth/jwt-auth.module';
import { LoggingMiddleware } from './common/middleware/logging.middleware';
import { GamesModule } from './games/games.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, JwtAuthModule, GamesModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
