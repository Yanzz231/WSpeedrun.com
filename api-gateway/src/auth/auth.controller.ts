import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GatewayHttpService } from '../common/gateway-http.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private readonly authServiceUrl =
    process.env.AUTH_SERVICE_URL ?? 'http://localhost:3000';

  constructor(private readonly gateway: GatewayHttpService) {}

  @Post('register')
  register(@Body() body: unknown) {
    return this.gateway.request(
      this.authServiceUrl,
      '/auth/register',
      'POST',
      body,
    );
  }

  @Post('login')
  login(@Body() body: unknown) {
    return this.gateway.request(
      this.authServiceUrl,
      '/auth/login',
      'POST',
      body,
    );
  }
}
