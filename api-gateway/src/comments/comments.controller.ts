import { Body, Controller, Delete, Headers, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GatewayHttpService } from '../common/gateway-http.service';

@ApiTags('Comments')
@ApiBearerAuth()
@Controller('comments')
export class CommentsController {
  private readonly runServiceUrl =
    process.env.RUN_SERVICE_URL ?? 'http://localhost:3002';

  constructor(private readonly gateway: GatewayHttpService) {}

  @Post()
  create(
    @Body() body: unknown,
    @Headers('authorization') authorization?: string,
  ) {
    return this.gateway.request(
      this.runServiceUrl,
      '/comments',
      'POST',
      body,
      authorization,
    );
  }

  @Delete(':id')
  delete(
    @Param('id') id: string,
    @Headers('authorization') authorization?: string,
  ) {
    return this.gateway.request(
      this.runServiceUrl,
      `/comments/${encodeURIComponent(id)}`,
      'DELETE',
      undefined,
      authorization,
    );
  }
}
