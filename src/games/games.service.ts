import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGameDto } from '../dto/games/create-game.dto';
import { UpdateGameDto } from '../dto/games/update-game.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class GamesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.games.findMany();
  }

  async findOne(id: string) {
    const game = await this.prisma.games.findUnique({
      where: { game_id: id },
      include: { run_categories: true },
    });

    if (!game) {
      throw new NotFoundException('Game not found');
    }

    return game;
  }

  async create(dto: CreateGameDto) {
    return this.prisma.games.create({
      data: {
        game_id: uuidv4(),
        game_name: dto.game_name,
        description: dto.description,
      },
    });
  }

  async update(id: string, dto: UpdateGameDto) {
    return this.prisma.games.update({
      where: { game_id: id },
      data: dto,
    });
  }

  async delete(id: string) {
    return this.prisma.games.delete({
      where: { game_id: id },
    });
  }
}