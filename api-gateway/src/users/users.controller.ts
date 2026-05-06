import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GatewayHttpService } from '../common/gateway-http.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  private readonly userServiceUrl =
    process.env.AUTH_SERVICE_URL ?? 'http://localhost:3000';

  constructor(private readonly gateway: GatewayHttpService) {}

  @Get(':id/profile')
  getProfile(@Param('id') id: string) {
    return this.gateway.request(
      this.userServiceUrl,
      `/users/${encodeURIComponent(id)}/profile`,
    );
  }
}
