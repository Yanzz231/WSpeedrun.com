import { Controller, Delete, Get, Post, Req, Res } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import type { Request, Response } from "express";
import { ProxyService } from "./proxy.service";

@ApiTags("Run Gateway")
@Controller()
export class RunGatewayController {
  constructor(private readonly proxyService: ProxyService) {}

  @Get("runs/:id/category")
  @ApiOperation({ summary: "Get leaderboard through Run Service" })
  @ApiParam({ name: "id", description: "Run category ID" })
  @ApiOkResponse({ description: "Run Service response." })
  getByCategory(@Req() req: Request, @Res() res: Response) {
    return this.proxyService.forward("run", req, res);
  }

  @Get("runs/:id/user")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get user runs through Run Service" })
  @ApiParam({ name: "id", description: "User ID" })
  @ApiOkResponse({ description: "Run Service response." })
  getByUser(@Req() req: Request, @Res() res: Response) {
    return this.proxyService.forward("run", req, res);
  }

  @Get("runs/:id")
  @ApiOperation({ summary: "Get run detail through Run Service" })
  @ApiParam({ name: "id", description: "Run ID" })
  @ApiOkResponse({ description: "Run Service response." })
  getDetail(@Req() req: Request, @Res() res: Response) {
    return this.proxyService.forward("run", req, res);
  }

  @Post("runs")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Submit run through Run Service" })
  @ApiBody({
    schema: {
      example: {
        run_category_id: "6f33dc11-4d74-4d26-89aa-b8284e4b5974",
        vod_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        run_duration: 3723,
      },
    },
  })
  @ApiOkResponse({ description: "Run Service response." })
  createRun(@Req() req: Request, @Res() res: Response) {
    return this.proxyService.forward("run", req, res);
  }

  @Post("comments")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create comment through Run Service" })
  @ApiBody({
    schema: {
      example: {
        run_id: "535d4b84-91ad-41a0-bbfb-f73029a6eccc",
        user_id: "08ea5372-08a9-4696-8ad5-4c2a0fcd3e0e",
        comment: "Clean route, nice run.",
      },
    },
  })
  @ApiOkResponse({ description: "Run Service response." })
  createComment(@Req() req: Request, @Res() res: Response) {
    return this.proxyService.forward("run", req, res);
  }

  @Delete("comments/:id")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete comment through Run Service" })
  @ApiParam({ name: "id", description: "Comment ID" })
  @ApiOkResponse({ description: "Run Service response." })
  deleteComment(@Req() req: Request, @Res() res: Response) {
    return this.proxyService.forward("run", req, res);
  }

  @Get("admin/runs/:status")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get runs by status through Run Service" })
  @ApiParam({
    name: "status",
    enum: ["PENDING", "ACCEPTED", "REJECTED"],
    description: "Run review status",
  })
  @ApiOkResponse({ description: "Run Service response." })
  getByStatus(@Req() req: Request, @Res() res: Response) {
    return this.proxyService.forward("run", req, res);
  }

  @Post("admin/runs/:id/accept")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Accept run through Run Service" })
  @ApiParam({ name: "id", description: "Run ID" })
  @ApiOkResponse({ description: "Run Service response." })
  accept(@Req() req: Request, @Res() res: Response) {
    return this.proxyService.forward("run", req, res);
  }

  @Post("admin/runs/:id/reject")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Reject run through Run Service" })
  @ApiParam({ name: "id", description: "Run ID" })
  @ApiOkResponse({ description: "Run Service response." })
  reject(@Req() req: Request, @Res() res: Response) {
    return this.proxyService.forward("run", req, res);
  }
}
