// Module
import { Module } from "@nestjs/common";

// Service
import { ProxyService } from "./proxy.service";

// Controller
import { AuthGatewayController } from "./auth-gateway.controller";
import { GameGatewayController } from "./game-gateway.controller";
import { RunGatewayController } from "./run-gateway.controller";

@Module({
  controllers: [
    AuthGatewayController,
    GameGatewayController,
    RunGatewayController,
  ],
  providers: [ProxyService],
})
export class ProxyModule {}
