// Module
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// Module
import { AuthModule } from './auth/auth.module';

// Middleware
import { LoggingMiddleware } from './common/middleware/logging.middleware';

// Feature
import { PrismaModule } from './prisma/prisma.module';
import { RunsModule } from './runs/runs.module';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    RunsModule,
    CommentsModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
