// Module
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

// Middleware
import { JwtAuthModule } from './common/auth/jwt-auth.module';
import { LoggingMiddleware } from './common/middleware/logging.middleware';

// Feature
import { GamesModule } from './games/games.module';
import { PrismaModule } from './prisma/prisma.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [PrismaModule, JwtAuthModule, GamesModule, CategoriesModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
