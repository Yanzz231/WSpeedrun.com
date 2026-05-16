import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtAuthModule } from './auth/jwt-auth.module';
import { LoggingMiddleware } from './common/middleware/logging.middleware';
import { PrismaModule } from './prisma/prisma.module';
import { RunsModule } from './runs/runs.module';

@Module({
  imports: [PrismaModule, JwtAuthModule, RunsModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
