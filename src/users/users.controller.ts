import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id/profile')
  @ApiOperation({ summary: 'Get user profile by ID' })
  getProfile(@Param('id') id: string) {
    return this.usersService.getProfile(id);
  }
}
