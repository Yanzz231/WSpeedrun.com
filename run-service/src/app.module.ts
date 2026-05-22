// Module
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

// Middleware
import { JwtAuthModule } from './common/auth/jwt-auth.module';
import { LoggingMiddleware } from './common/middleware/logging.middleware';

// Feature
import { PrismaModule } from './prisma/prisma.module';
import { RunsModule } from './runs/runs.module';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [PrismaModule, JwtAuthModule, RunsModule, CommentsModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
