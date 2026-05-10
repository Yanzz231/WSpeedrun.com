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
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateRunDto } from './dto/create-run.dto';
import { RunsService } from './runs.service';

@ApiTags('Runs')
@Controller('runs')
export class RunsController {
  constructor(private readonly runsService: RunsService) {}

  @Get(':id/category')
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
  @Get(':id/user')
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

  @Get(':id')
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
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit a new run' })
  @ApiBody({ type: CreateRunDto })
  @ApiCreatedResponse({ description: 'Run submitted with PENDING status.' })
  @ApiBadRequestResponse({ description: 'Run category not found.' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token.' })
  create(@Body() dto: CreateRunDto, @Req() req) {
    return this.runsService.create(dto, req.user);
  }
}
