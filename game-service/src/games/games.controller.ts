// MODULE
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiBody,
  ApiCreatedResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';

// Middleware
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';

// SERVICE
import { GamesService } from './games.service';

// DTO
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';

@ApiTags('Games')
@Controller()
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get('games')
  @ApiOperation({ summary: 'Get all games' })
  @ApiOkResponse({ description: 'List of all games.' })
  findAll() {
    return this.gamesService.findAll();
  }

  @Get('games/:id')
  @ApiOperation({ summary: 'Get game detail' })
  @ApiParam({ name: 'id', description: 'Game ID' })
  @ApiOkResponse({ description: 'Game detail with associated run categories.' })
  @ApiNotFoundResponse({ description: 'Game not found.' })
  findOne(@Param('id') id: string) {
    return this.gamesService.findOne(id);
  }

  // ADMIN
  @Post('admin/games')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Create game' })
  @ApiBody({ type: CreateGameDto })
  @ApiCreatedResponse({ description: 'Game created successfully.' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token.' })
  @ApiForbiddenResponse({ description: 'Admin role is required.' })
  create(@Body() dto: CreateGameDto) {
    return this.gamesService.create(dto);
  }

  @Patch('admin/games/:id/update')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Update game' })
  @ApiParam({ name: 'id', description: 'Game ID' })
  @ApiBody({ type: UpdateGameDto })
  @ApiOkResponse({ description: 'Game updated successfully.' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token.' })
  @ApiForbiddenResponse({ description: 'Admin role is required.' })
  @ApiNotFoundResponse({ description: 'Game not found.' })
  update(@Param('id') id: string, @Body() dto: UpdateGameDto) {
    return this.gamesService.update(id, dto);
  }

  @Delete('admin/games/:id/delete')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete game' })
  @ApiParam({ name: 'id', description: 'Game ID' })
  @ApiOkResponse({ description: 'Game deleted successfully.' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token.' })
  @ApiForbiddenResponse({ description: 'Admin role is required.' })
  @ApiNotFoundResponse({ description: 'Game not found.' })
  delete(@Param('id') id: string) {
    return this.gamesService.delete(id);
  }
}
