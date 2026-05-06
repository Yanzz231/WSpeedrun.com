import { Controller, Get, Param } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { ProfileDto } from "./dto/profile.dto";

@ApiTags("Users")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(":id/profile")
  @ApiOperation({ summary: "Get user profile by ID" })
  @ApiParam({ name: "id", description: "User ID" })
  @ApiResponse({ status: 200, type: ProfileDto })
  @ApiResponse({ status: 404, description: "User not found" })
  getProfile(@Param("id") id: string) {
    return this.usersService.getProfile(id);
  }
}
