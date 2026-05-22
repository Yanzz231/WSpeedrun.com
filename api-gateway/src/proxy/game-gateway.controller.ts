// Module
import { Controller, Delete, Get, Patch, Post, Req, Res } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import type { Request, Response } from "express";

// Service
import { ProxyService } from "./proxy.service";

@ApiTags("Game Gateway")
@Controller()
export class GameGatewayController {
  constructor(private readonly proxyService: ProxyService) {}

  @Get("games")
  @ApiOperation({ summary: "Get all games through Game Service" })
  @ApiOkResponse({ description: "Game Service response." })
  findAllGames(@Req() req: Request, @Res() res: Response) {
    return this.proxyService.forward("game", req, res);
  }

  @Get("games/:id")
  @ApiOperation({ summary: "Get game detail through Game Service" })
  @ApiParam({ name: "id", description: "Game ID" })
  @ApiOkResponse({ description: "Game Service response." })
  findGame(@Req() req: Request, @Res() res: Response) {
    return this.proxyService.forward("game", req, res);
  }

  @Get("categories/:id")
  @ApiOperation({ summary: "Get category detail through Game Service" })
  @ApiParam({ name: "id", description: "Run category ID" })
  @ApiOkResponse({ description: "Game Service response." })
  findCategory(@Req() req: Request, @Res() res: Response) {
    return this.proxyService.forward("game", req, res);
  }

  @Post("admin/games")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create game through Game Service" })
  @ApiBody({
    schema: {
      example: {
        game_name: "Celeste",
        description: "A precision platformer speedrun title.",
      },
    },
  })
  @ApiOkResponse({ description: "Game Service response." })
  createGame(@Req() req: Request, @Res() res: Response) {
    return this.proxyService.forward("game", req, res);
  }

  @Patch("admin/games/:id/update")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update game through Game Service" })
  @ApiParam({ name: "id", description: "Game ID" })
  @ApiBody({
    schema: {
      example: {
        game_name: "Celeste Classic",
        description: "Updated description.",
      },
    },
  })
  @ApiOkResponse({ description: "Game Service response." })
  updateGame(@Req() req: Request, @Res() res: Response) {
    return this.proxyService.forward("game", req, res);
  }

  @Delete("admin/games/:id/delete")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete game through Game Service" })
  @ApiParam({ name: "id", description: "Game ID" })
  @ApiOkResponse({ description: "Game Service response." })
  deleteGame(@Req() req: Request, @Res() res: Response) {
    return this.proxyService.forward("game", req, res);
  }

  @Post("admin/categories")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create category through Game Service" })
  @ApiBody({
    schema: {
      example: {
        game_id: "6f33dc11-4d74-4d26-89aa-b8284e4b5974",
        run_category_name: "Any%",
      },
    },
  })
  @ApiOkResponse({ description: "Game Service response." })
  createCategory(@Req() req: Request, @Res() res: Response) {
    return this.proxyService.forward("game", req, res);
  }

  @Patch("admin/categories/:id/update")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update category through Game Service" })
  @ApiParam({ name: "id", description: "Run category ID" })
  @ApiBody({
    schema: {
      example: {
        run_category_name: "100%",
      },
    },
  })
  @ApiOkResponse({ description: "Game Service response." })
  updateCategory(@Req() req: Request, @Res() res: Response) {
    return this.proxyService.forward("game", req, res);
  }

  @Delete("admin/categories/:id/delete")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete category through Game Service" })
  @ApiParam({ name: "id", description: "Run category ID" })
  @ApiOkResponse({ description: "Game Service response." })
  deleteCategory(@Req() req: Request, @Res() res: Response) {
    return this.proxyService.forward("game", req, res);
  }
}
