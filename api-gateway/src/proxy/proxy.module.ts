import { Module } from "@nestjs/common";
import { AuthGatewayController } from "./auth-gateway.controller";
import { GameGatewayController } from "./game-gateway.controller";
import { ProxyService } from "./proxy.service";
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
