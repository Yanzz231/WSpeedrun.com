// Module
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiBody,
  ApiCreatedResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';

// Middleware
import { Roles } from '../common/auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/auth/guards/roles.guard';

// Service
import { CategoriesService } from './categories.service';

// DTO
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('Categories')
@Controller()
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get('categories/:id')
  @ApiOperation({ summary: 'Get run category detail' })
  @ApiParam({ name: 'id', description: 'Run category ID' })
  @ApiOkResponse({ description: 'Run category detail with game information.' })
  @ApiNotFoundResponse({ description: 'Category not found.' })
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Post('admin/categories')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Create run category' })
  @ApiBody({ type: CreateCategoryDto })
  @ApiCreatedResponse({ description: 'Run category created successfully.' })
  @ApiBadRequestResponse({ description: 'Game ID does not exist.' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token.' })
  @ApiForbiddenResponse({ description: 'Admin role is required.' })
  create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(dto);
  }

  @Patch('admin/categories/:id/update')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Update run category' })
  @ApiParam({ name: 'id', description: 'Run category ID' })
  @ApiBody({ type: UpdateCategoryDto })
  @ApiOkResponse({ description: 'Run category updated successfully.' })
  @ApiBadRequestResponse({ description: 'Game ID does not exist.' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token.' })
  @ApiForbiddenResponse({ description: 'Admin role is required.' })
  @ApiNotFoundResponse({ description: 'Category not found.' })
  update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.categoriesService.update(id, dto);
  }

  @Delete('admin/categories/:id/delete')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete run category' })
  @ApiParam({ name: 'id', description: 'Run category ID' })
  @ApiOkResponse({ description: 'Run category deleted successfully.' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token.' })
  @ApiForbiddenResponse({ description: 'Admin role is required.' })
  @ApiNotFoundResponse({ description: 'Category not found.' })
  delete(@Param('id') id: string) {
    return this.categoriesService.delete(id);
  }
}
