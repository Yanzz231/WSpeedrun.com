import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { adminGamesController } from './admin/admin-games.controller';
import { CategoriesModule } from './categories/categories.module';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';

@Module({
  imports: [PrismaModule, CategoriesModule],
  controllers: [GamesController, adminGamesController],
  providers: [GamesService],
})
export class GamesModule {}
