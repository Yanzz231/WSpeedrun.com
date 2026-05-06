import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { Roles } from '../../auth/roles.decorator';
import { RolesGuard } from '../../auth/roles.guard';
import { RunsService } from '../runs.service';

@ApiTags('Admin - Runs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin/runs')
export class AdminRunsController {
  constructor(private readonly runsService: RunsService) {}

  @Get(':status')
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

  @Post(':id/accept')
  @ApiOperation({ summary: 'Accept a run entry' })
  @ApiParam({ name: 'id', description: 'Run ID' })
  @ApiOkResponse({ description: 'Run accepted successfully.' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token.' })
  @ApiForbiddenResponse({ description: 'Admin role is required.' })
  @ApiNotFoundResponse({ description: 'Run not found.' })
  accept(@Param('id') id: string) {
    return this.runsService.accept(id);
  }

  @Post(':id/reject')
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
