import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { Roles } from '../../auth/roles.decorator';
import { RolesGuard } from '../../auth/roles.guard';
import { CreateGameDto } from '../dto/create-game.dto';
import { UpdateGameDto } from '../dto/update-game.dto';
import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GamesService } from '../games.service';

@ApiTags('Admin - Games')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin/games')
export class adminGamesController {
  constructor(private readonly adminGamesService: GamesService) {}

  @Post()
  @ApiOperation({ summary: 'Create game' })
  @ApiBody({ type: CreateGameDto })
  @ApiCreatedResponse({ description: 'Game created successfully.' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token.' })
  @ApiForbiddenResponse({ description: 'Admin role is required.' })
  create(@Body() dto: CreateGameDto) {
    return this.adminGamesService.create(dto);
  }

  @Patch(':id/update')
  @ApiOperation({ summary: 'Update game' })
  @ApiParam({ name: 'id', description: 'Game ID' })
  @ApiBody({ type: UpdateGameDto })
  @ApiOkResponse({ description: 'Game updated successfully.' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token.' })
  @ApiForbiddenResponse({ description: 'Admin role is required.' })
  @ApiNotFoundResponse({ description: 'Game not found.' })
  update(@Param('id') id: string, @Body() dto: UpdateGameDto) {
    return this.adminGamesService.update(id, dto);
  }

  @Delete(':id/delete')
  @ApiOperation({ summary: 'Delete game' })
  @ApiParam({ name: 'id', description: 'Game ID' })
  @ApiOkResponse({ description: 'Game deleted successfully.' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token.' })
  @ApiForbiddenResponse({ description: 'Admin role is required.' })
  @ApiNotFoundResponse({ description: 'Game not found.' })
  delete(@Param('id') id: string) {
    return this.adminGamesService.delete(id);
  }
}
