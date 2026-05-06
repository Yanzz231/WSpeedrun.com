import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string) {
    const category = await this.prisma.run_categories.findUnique({
      where: { run_category_id: id },
      include: {
        game: true,
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async create(dto: CreateCategoryDto) {
    // VALIDATE game_id exists
    const game = await this.prisma.games.findUnique({
      where: { game_id: dto.game_id },
    });

    if (!game) {
      throw new BadRequestException('Game ID does not exist');
    }

    return this.prisma.run_categories.create({
      data: {
        run_category_id: uuidv4(),
        game_id: dto.game_id,
        run_category_name: dto.run_category_name,
      },
    });
  }

  async update(id: string, dto: UpdateCategoryDto) {
    if (dto.game_id) {
      const game = await this.prisma.games.findUnique({
        where: { game_id: dto.game_id },
      });

      if (!game) {
        throw new BadRequestException('Game ID does not exist');
      }
    }

    try {
      return await this.prisma.run_categories.update({
        where: { run_category_id: id },
        data: dto,
      });
    } catch {
      throw new NotFoundException('Category not found');
    }
  }

  async delete(id: string) {
    try {
      return await this.prisma.run_categories.delete({
        where: { run_category_id: id },
      });
    } catch {
      throw new NotFoundException('Category not found');
    }
  }
}
