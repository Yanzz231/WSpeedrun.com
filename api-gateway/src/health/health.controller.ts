// Module
import { Controller, Get } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("Gateway")
@Controller()
export class HealthController {
  @Get()
  @ApiOperation({ summary: "Get gateway route map" })
  @ApiOkResponse({ description: "Gateway route map." })
  getRouteMap() {
    return {
      service: "wspeedrun-api-gateway",
      routes: {
        auth: ["/auth", "/users"],
        game: ["/games", "/categories", "/admin/games", "/admin/categories"],
        run: ["/runs", "/comments", "/admin/runs"],
      },
    };
  }

  @Get("health")
  @ApiOperation({ summary: "Gateway health check" })
  @ApiOkResponse({ description: "Gateway is running." })
  health() {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
    };
  }
}
