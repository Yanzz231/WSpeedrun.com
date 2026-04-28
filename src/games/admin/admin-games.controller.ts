import { CreateGameDto } from '../../dto/games/create-game.dto';
import { UpdateGameDto } from '../../dto/games/update-game.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import {
    Controller,
    Post,
    Patch,
    Delete,
    Param,
    Body,
    UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { GamesService } from '../games.service';

@ApiTags('Admin')
@Controller('admin/games')
export class adminGamesController {
    constructor(private readonly adminGamesService: GamesService) {}
    // PROTECTED (LOGIN ONLY)
    @UseGuards(JwtAuthGuard)
    @Post()
    @ApiOperation({ summary: 'Create game' })
    create(@Body() dto: CreateGameDto) {
        return this.adminGamesService.create(dto);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id/update')
    @ApiOperation({ summary: 'Update game' })
    update(@Param('id') id: string, @Body() dto: UpdateGameDto) {
    return this.adminGamesService.update(id, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id/delete')
    @ApiOperation({ summary: 'Delete game' })
    delete(@Param('id') id: string) {
        return this.adminGamesService.delete(id);
    }
}