import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { PrismaService } from '../prisma/prisma.service';
import { adminCategoriesController } from './admin/admin-categories.controller';

@Module({
    controllers: [CategoriesController , adminCategoriesController],
    providers: [CategoriesService, PrismaService],
})
export class CategoriesModule {}