import {
    Controller,
    Get,
    Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';


@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    @Get(':id')
    @ApiOperation({ summary: 'Get category detail' })
    findOne(@Param('id') id: string) {
        return this.categoriesService.findOne(id);
    }
}