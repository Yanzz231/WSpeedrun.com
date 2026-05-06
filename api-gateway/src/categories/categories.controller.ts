import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GatewayHttpService } from '../common/gateway-http.service';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  private readonly gameServiceUrl =
    process.env.GAME_SERVICE_URL ?? 'http://localhost:3001';

  constructor(private readonly gateway: GatewayHttpService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gateway.request(
      this.gameServiceUrl,
      `/categories/${encodeURIComponent(id)}`,
    );
  }
}

@ApiTags('Admin - Categories')
@ApiBearerAuth()
@Controller('admin/categories')
export class AdminCategoriesController {
  private readonly gameServiceUrl =
    process.env.GAME_SERVICE_URL ?? 'http://localhost:3001';

  constructor(private readonly gateway: GatewayHttpService) {}

  @Post()
  create(
    @Body() body: unknown,
    @Headers('authorization') authorization?: string,
  ) {
    return this.gateway.request(
      this.gameServiceUrl,
      '/admin/categories',
      'POST',
      body,
      authorization,
    );
  }

  @Patch(':id/update')
  update(
    @Param('id') id: string,
    @Body() body: unknown,
    @Headers('authorization') authorization?: string,
  ) {
    return this.gateway.request(
      this.gameServiceUrl,
      `/admin/categories/${encodeURIComponent(id)}/update`,
      'PATCH',
      body,
      authorization,
    );
  }

  @Delete(':id/delete')
  delete(
    @Param('id') id: string,
    @Headers('authorization') authorization?: string,
  ) {
    return this.gateway.request(
      this.gameServiceUrl,
      `/admin/categories/${encodeURIComponent(id)}/delete`,
      'DELETE',
      undefined,
      authorization,
    );
  }
}
