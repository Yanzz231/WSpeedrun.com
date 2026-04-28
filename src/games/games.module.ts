import { Module } from '@nestjs/common';
import { GamesController } from  './games.controller'
import { GamesService } from './games.service';
import { PrismaService } from '../prisma/prisma.service';
import { adminGamesController } from './admin/admin-games.controller';

@Module({
  controllers: [GamesController , adminGamesController],
  providers: [GamesService, PrismaService],
})
export class GamesModule {}