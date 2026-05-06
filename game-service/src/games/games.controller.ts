import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { GamesService } from './games.service';

@ApiTags('Games')
@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  // PUBLIC
  @Get()
  @ApiOperation({ summary: 'Get all games' })
  @ApiOkResponse({ description: 'List of all games.' })
  findAll() {
    return this.gamesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get game detail' })
  @ApiParam({ name: 'id', description: 'Game ID' })
  @ApiOkResponse({ description: 'Game detail with associated run categories.' })
  @ApiNotFoundResponse({ description: 'Game not found.' })
  findOne(@Param('id') id: string) {
    return this.gamesService.findOne(id);
  }
}
