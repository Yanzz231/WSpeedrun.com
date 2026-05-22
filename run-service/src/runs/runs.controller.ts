// Module
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';

// Middleware
import { Roles } from '../common/auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/auth/guards/roles.guard';

// Service
import { RunsService } from './runs.service';

// DTO
import { CreateRunDto } from './dto/create-run.dto';

@ApiTags('Runs')
@Controller()
export class RunsController {
  constructor(private readonly runsService: RunsService) {}

  @Get('runs/:id/category')
  @ApiOperation({ summary: 'Get accepted runs by run category' })
  @ApiParam({ name: 'id', description: 'Run category ID' })
  @ApiOkResponse({
    description:
      'Accepted runs for the category, sorted by run duration ascending.',
  })
  @ApiNotFoundResponse({ description: 'Category not found.' })
  getByCategory(@Param('id') id: string) {
    return this.runsService.getByCategory(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('runs/:id/user')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get runs submitted by a user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiOkResponse({
    description:
      'All own runs when the ID matches the token user; accepted runs otherwise.',
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token.' })
  @ApiNotFoundResponse({ description: 'User not found.' })
  getByUser(@Param('id') id: string, @Req() req) {
    return this.runsService.getByUser(id, req.user);
  }

  @Get('runs/:id')
  @ApiOperation({ summary: 'Get run detail' })
  @ApiParam({ name: 'id', description: 'Run ID' })
  @ApiOkResponse({
    description:
      'Run detail with category, game information, comments, and runner information.',
  })
  @ApiNotFoundResponse({ description: 'Run not found.' })
  getDetail(@Param('id') id: string) {
    return this.runsService.getDetail(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('runs')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit a new run' })
  @ApiBody({ type: CreateRunDto })
  @ApiCreatedResponse({ description: 'Run submitted with PENDING status.' })
  @ApiBadRequestResponse({ description: 'Run category not found.' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token.' })
  create(@Body() dto: CreateRunDto, @Req() req) {
    return this.runsService.create(dto, req.user);
  }

  // ADMIN
  @Get('admin/runs/:status')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Get run entries filtered by status' })
  @ApiParam({
    name: 'status',
    enum: ['PENDING', 'ACCEPTED', 'REJECTED'],
    description: 'Run review status',
  })
  @ApiOkResponse({ description: 'Runs matching the requested status.' })
  @ApiBadRequestResponse({
    description: 'Status must be PENDING, ACCEPTED, or REJECTED.',
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token.' })
  @ApiForbiddenResponse({ description: 'Admin role is required.' })
  getByStatus(@Param('status') status: string) {
    return this.runsService.getByStatus(status);
  }

  @Post('admin/runs/:id/accept')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Accept a run entry' })
  @ApiParam({ name: 'id', description: 'Run ID' })
  @ApiOkResponse({ description: 'Run accepted successfully.' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token.' })
  @ApiForbiddenResponse({ description: 'Admin role is required.' })
  @ApiNotFoundResponse({ description: 'Run not found.' })
  accept(@Param('id') id: string) {
    return this.runsService.accept(id);
  }

  @Post('admin/runs/:id/reject')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Reject a run entry' })
  @ApiParam({ name: 'id', description: 'Run ID' })
  @ApiOkResponse({ description: 'Run rejected successfully.' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token.' })
  @ApiForbiddenResponse({ description: 'Admin role is required.' })
  @ApiNotFoundResponse({ description: 'Run not found.' })
  reject(@Param('id') id: string) {
    return this.runsService.reject(id);
  }
}
