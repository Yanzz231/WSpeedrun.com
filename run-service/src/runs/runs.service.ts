// Module
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { fetchServiceJson } from '../common/http/service-client';

// Service
import { PrismaService } from '../prisma/prisma.service';

// DTO
import { CreateRunDto } from './dto/create-run.dto';
import type {
  ServiceCategoryDto,
  ServiceUserDto,
} from './dto/run-response.dto';

// Utils
import { normalizeRunStatus, serializeRun } from './utils/run.utils';

type AuthUser = {
  userId: string;
  role: string;
};

@Injectable()
export class RunsService {
  private readonly authServiceUrl =
    process.env.AUTH_SERVICE_URL ?? 'http://localhost:3000';
  private readonly gameServiceUrl =
    process.env.GAME_SERVICE_URL ?? 'http://localhost:3001';

  constructor(private prisma: PrismaService) {}

  private getUser(userId: string) {
    const url = `${this.authServiceUrl}/users/${encodeURIComponent(
      userId,
    )}/profile`;

    return fetchServiceJson<Omit<ServiceUserDto, 'user_id'>>(
      url,
      'User not found',
    ).then((profile) => ({ user_id: userId, ...profile }));
  }

  private getCategory(categoryId: string) {
    const url = `${this.gameServiceUrl}/categories/${encodeURIComponent(
      categoryId,
    )}`;

    return fetchServiceJson<ServiceCategoryDto>(url, 'Category not found');
  }

  private async getUsersById(userIds: string[]) {
    const uniqueUserIds = [...new Set(userIds)];

    if (!uniqueUserIds.length) {
      return new Map<string, ServiceUserDto>();
    }

    const users = await Promise.all(
      uniqueUserIds.map((userId) => this.getUser(userId)),
    );

    return new Map(users.map((user) => [user.user_id, user]));
  }

  private async getCategoriesById(categoryIds: string[]) {
    const uniqueCategoryIds = [...new Set(categoryIds)];

    if (!uniqueCategoryIds.length) {
      return new Map<string, ServiceCategoryDto>();
    }

    const categories = await Promise.all(
      uniqueCategoryIds.map((categoryId) => this.getCategory(categoryId)),
    );

    return new Map(
      categories.map((category) => [category.run_category_id, category]),
    );
  }

  private async ensureCategoryExists(categoryId: string) {
    try {
      return await this.getCategory(categoryId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new BadRequestException('Category not found');
      }

      throw error;
    }
  }

  async getByCategory(id: string) {
    const category = await this.getCategory(id);

    const runs = await this.prisma.runs.findMany({
      where: {
        run_category_id: id,
        status: 'ACCEPTED',
      },
      orderBy: {
        run_duration: 'asc',
      },
    });

    const usersById = await this.getUsersById(runs.map((run) => run.user_id));

    return runs.map((run) =>
      serializeRun(run, usersById.get(run.user_id), category),
    );
  }

  async getDetail(id: string) {
    const run = await this.prisma.runs.findUnique({
      where: { run_id: id },
      include: {
        comments: true,
      },
    });

    if (!run) throw new NotFoundException('Run not found');
    if (run.status !== 'ACCEPTED') throw new NotFoundException('Run not found');

    const [user, runCategory, usersById] = await Promise.all([
      this.getUser(run.user_id),
      this.getCategory(run.run_category_id),
      this.getUsersById(run.comments.map((comment) => comment.user_id)),
    ]);

    const comments = run.comments.map((comment) => ({
      ...comment,
      user: usersById.get(comment.user_id),
    }));

    return serializeRun({ ...run, comments }, user, runCategory);
  }

  async getByUser(userId: string, authUser: AuthUser) {
    const isSelf = userId === authUser.userId;
    const user = await this.getUser(userId);

    const runs = await this.prisma.runs.findMany({
      where: {
        user_id: userId,
        ...(isSelf ? {} : { status: 'ACCEPTED' }),
      },
      orderBy: {
        submitted_at: 'desc',
      },
    });

    const categoriesById = await this.getCategoriesById(
      runs.map((run) => run.run_category_id),
    );

    return runs.map((run) =>
      serializeRun(run, user, categoriesById.get(run.run_category_id)),
    );
  }

  async create(dto: CreateRunDto, user: AuthUser) {
    await this.ensureCategoryExists(dto.run_category_id);

    const createdRun = await this.prisma.runs.create({
      data: {
        run_id: uuidv4(),
        user_id: user.userId,
        run_category_id: dto.run_category_id,
        vod_url: dto.vod_url,
        run_duration: BigInt(dto.run_duration),
        submitted_at: new Date(),
        status: 'PENDING',
      },
    });

    return {
      message: 'Run submitted successfully',
      run: serializeRun(createdRun),
    };
  }

  // ADMIN
  async getByStatus(status: string) {
    const normalizedStatus = normalizeRunStatus(status);

    if (!normalizedStatus) {
      throw new BadRequestException(
        'Status must be PENDING, ACCEPTED, or REJECTED',
      );
    }

    const runs = await this.prisma.runs.findMany({
      where: { status: normalizedStatus },
      orderBy: {
        submitted_at: 'desc',
      },
    });

    const [usersById, categoriesById] = await Promise.all([
      this.getUsersById(runs.map((run) => run.user_id)),
      this.getCategoriesById(runs.map((run) => run.run_category_id)),
    ]);

    return runs.map((run) =>
      serializeRun(
        run,
        usersById.get(run.user_id),
        categoriesById.get(run.run_category_id),
      ),
    );
  }

  async accept(id: string) {
    return this.review(id, 'ACCEPTED');
  }

  async reject(id: string) {
    return this.review(id, 'REJECTED');
  }

  private async review(id: string, status: 'ACCEPTED' | 'REJECTED') {
    const existingRun = await this.prisma.runs.findUnique({
      where: { run_id: id },
    });

    if (!existingRun) {
      throw new NotFoundException('Run not found');
    }

    const updatedRun = await this.prisma.runs.update({
      where: { run_id: id },
      data: {
        status,
        verified_at: new Date(),
      },
    });

    return {
      message: `Run ${status.toLowerCase()} successfully`,
      run: serializeRun(updatedRun),
    };
  }
}
