import { Controller, Get, Post, Req, Res } from "@nestjs/common";
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import type { Request, Response } from "express";
import { ProxyService } from "./proxy.service";

@ApiTags("Auth Gateway")
@Controller()
export class AuthGatewayController {
  constructor(private readonly proxyService: ProxyService) {}

  @Post("auth/register")
  @ApiOperation({ summary: "Register through Auth Service" })
  @ApiBody({
    schema: {
      example: {
        username: "speedrunner",
        email: "runner@example.com",
        country: "Indonesia",
        password: "Password123!",
      },
    },
  })
  @ApiOkResponse({ description: "Auth Service response." })
  register(@Req() req: Request, @Res() res: Response) {
    return this.proxyService.forward("auth", req, res);
  }

  @Post("auth/login")
  @ApiOperation({ summary: "Login through Auth Service" })
  @ApiBody({
    schema: {
      example: {
        email: "runner@example.com",
        password: "Password123!",
      },
    },
  })
  @ApiOkResponse({ description: "Auth Service response." })
  login(@Req() req: Request, @Res() res: Response) {
    return this.proxyService.forward("auth", req, res);
  }

  @Get("users/:id/profile")
  @ApiOperation({ summary: "Get user profile through Auth Service" })
  @ApiParam({ name: "id", description: "User ID" })
  @ApiOkResponse({ description: "Auth Service response." })
  getProfile(@Req() req: Request, @Res() res: Response) {
    return this.proxyService.forward("auth", req, res);
  }
}
