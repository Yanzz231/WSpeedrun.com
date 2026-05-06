import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import {
  AdminCategoriesController,
  CategoriesController,
} from './categories/categories.controller';
import { CommentsController } from './comments/comments.controller';
import { GatewayHttpService } from './common/gateway-http.service';
import {
  AdminGamesController,
  GamesController,
} from './games/games.controller';
import { AdminRunsController, RunsController } from './runs/runs.controller';
import { UsersController } from './users/users.controller';

@Module({
  controllers: [
    AuthController,
    UsersController,
    GamesController,
    AdminGamesController,
    CategoriesController,
    AdminCategoriesController,
    RunsController,
    AdminRunsController,
    CommentsController,
  ],
  providers: [GatewayHttpService],
})
export class AppModule {}
