import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import {
    Controller,
    Post,
    Patch,
    Delete,
    Param,
    Body,
    UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CategoriesService } from '../categories.service';
import { CreateCategoryDto } from 'src/dto/categories/create-category.dto';
import { UpdateCategoryDto } from 'src/dto/categories/update-category.dto';

@ApiTags('Admin')
@Controller('admin/categories')
export class adminCategoriesController {
    constructor(private readonly adminCategoriesService: CategoriesService) {}
    // PROTECTED (LOGIN ONLY)
    @UseGuards(JwtAuthGuard)
    @Post()
    @ApiOperation({ summary: 'Create game' })
    create(@Body() dto: CreateCategoryDto) {
        return this.adminCategoriesService.create(dto);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id/update')
    @ApiOperation({ summary: 'Update game' })
    update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.adminCategoriesService.update(id, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id/delete')
    @ApiOperation({ summary: 'Delete game' })
    delete(@Param('id') id: string) {
        return this.adminCategoriesService.delete(id);
    }
}