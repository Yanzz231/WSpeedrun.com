// Module
import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";

// Middleware
import { AuthModule } from "./auth/auth.module";
import { LoggingMiddleware } from "./common/middleware/logging.middleware";

// Feature
import { PrismaModule } from "./prisma/prisma.module";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [PrismaModule, AuthModule, UsersModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes("*");
  }
}
