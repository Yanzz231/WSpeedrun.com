import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { GamesService } from './games.service';
import { CreateGameDto } from '../dto/games/create-game.dto';
import { UpdateGameDto } from '../dto/games/update-game.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Games')
@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  // PUBLIC
  @Get()
  @ApiOperation({ summary: 'Get all games' })
  findAll() {
    return this.gamesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get game detail' })
  findOne(@Param('id') id: string) {
    return this.gamesService.findOne(id);
  }

  // PROTECTED (LOGIN ONLY)
  @UseGuards(JwtAuthGuard)
  @Post('/admin/create')
  @ApiOperation({ summary: 'Create game' })
  create(@Body() dto: CreateGameDto) {
    return this.gamesService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('admin/:id/update')
  @ApiOperation({ summary: 'Update game' })
  update(@Param('id') id: string, @Body() dto: UpdateGameDto) {
    return this.gamesService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('admin/:id/delete')
  @ApiOperation({ summary: 'Delete game' })
  delete(@Param('id') id: string) {
    return this.gamesService.delete(id);
  }
}