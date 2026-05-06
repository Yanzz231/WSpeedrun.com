import { Body, Controller, Get, Headers, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GatewayHttpService } from '../common/gateway-http.service';

@ApiTags('Runs')
@Controller('runs')
export class RunsController {
  private readonly runServiceUrl =
    process.env.RUN_SERVICE_URL ?? 'http://localhost:3002';

  constructor(private readonly gateway: GatewayHttpService) {}

  @Get(':id/category')
  getByCategory(@Param('id') id: string) {
    return this.gateway.request(
      this.runServiceUrl,
      `/runs/${encodeURIComponent(id)}/category`,
    );
  }

  @ApiBearerAuth()
  @Get(':id/user')
  getByUser(
    @Param('id') id: string,
    @Headers('authorization') authorization?: string,
  ) {
    return this.gateway.request(
      this.runServiceUrl,
      `/runs/${encodeURIComponent(id)}/user`,
      'GET',
      undefined,
      authorization,
    );
  }

  @Get(':id')
  getDetail(@Param('id') id: string) {
    return this.gateway.request(
      this.runServiceUrl,
      `/runs/${encodeURIComponent(id)}`,
    );
  }

  @ApiBearerAuth()
  @Post()
  create(
    @Body() body: unknown,
    @Headers('authorization') authorization?: string,
  ) {
    return this.gateway.request(
      this.runServiceUrl,
      '/runs',
      'POST',
      body,
      authorization,
    );
  }
}

@ApiTags('Admin - Runs')
@ApiBearerAuth()
@Controller('admin/runs')
export class AdminRunsController {
  private readonly runServiceUrl =
    process.env.RUN_SERVICE_URL ?? 'http://localhost:3002';

  constructor(private readonly gateway: GatewayHttpService) {}

  @Get(':status')
  getByStatus(
    @Param('status') status: string,
    @Headers('authorization') authorization?: string,
  ) {
    return this.gateway.request(
      this.runServiceUrl,
      `/admin/runs/${encodeURIComponent(status)}`,
      'GET',
      undefined,
      authorization,
    );
  }

  @Post(':id/accept')
  accept(
    @Param('id') id: string,
    @Headers('authorization') authorization?: string,
  ) {
    return this.gateway.request(
      this.runServiceUrl,
      `/admin/runs/${encodeURIComponent(id)}/accept`,
      'POST',
      undefined,
      authorization,
    );
  }

  @Post(':id/reject')
  reject(
    @Param('id') id: string,
    @Headers('authorization') authorization?: string,
  ) {
    return this.gateway.request(
      this.runServiceUrl,
      `/admin/runs/${encodeURIComponent(id)}/reject`,
      'POST',
      undefined,
      authorization,
    );
  }
}
