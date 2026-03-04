import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { ProfileDto } from '../dto/users/profile.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id/profile')
  @ApiOperation({ summary: 'Get user profile by ID' })
  @ApiResponse({ status: 200, type: ProfileDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  getProfile(@Param('id') id: string) {
    return this.usersService.getProfile(id);
  }
}
