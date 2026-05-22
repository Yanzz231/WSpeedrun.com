// Module
import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";

// Middleware
import { LoggingMiddleware } from "./common/middleware/logging.middleware";
import { HealthController } from "./health/health.controller";

// Feature
import { ProxyModule } from "./proxy/proxy.module";

@Module({
  imports: [ProxyModule],
  controllers: [HealthController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes("{*splat}");
  }
}
