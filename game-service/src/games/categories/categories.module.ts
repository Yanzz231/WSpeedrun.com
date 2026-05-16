import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { adminCategoriesController } from './admin/admin-categories.controller';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

@Module({
  imports: [PrismaModule],
  controllers: [CategoriesController, adminCategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
