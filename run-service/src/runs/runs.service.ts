import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { fetchServiceJson } from '../common/http/service-client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRunDto } from './dto/create-run.dto';

type ServiceUser = {
  user_id: string;
  username: string;
  email: string;
  country: string;
  role: string;
};

type ServiceCategory = {
  run_category_id: string;
  game_id: string;
  run_category_name: string;
  game?: {
    game_id: string;
    game_name: string;
    description: string;
  };
};

@Injectable()
export class RunsService {
  private readonly authServiceUrl =
    process.env.AUTH_SERVICE_URL ?? 'http://localhost:3000';
  private readonly gameServiceUrl =
    process.env.GAME_SERVICE_URL ?? 'http://localhost:3001';

  constructor(private prisma: PrismaService) {}

  formatDuration(sec: number) {
    sec = Number(sec);
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h} Hour(s) ${m} Minute(s) ${s} Second(s)`;
  }

  private serializeRun(
    run: any,
    user?: ServiceUser,
    runCategory?: ServiceCategory,
  ) {
    const runDuration = Number(run.run_duration);

    return {
      ...run,
      run_duration: runDuration,
      ...(user ? { user } : {}),
      ...(runCategory ? { run_category: runCategory } : {}),
      formatted_duration: this.formatDuration(runDuration),
    };
  }

  private getUser(userId: string) {
    const url = `${this.authServiceUrl}/users/${encodeURIComponent(
      userId,
    )}/profile`;

    return fetchServiceJson<Omit<ServiceUser, 'user_id'>>(
      url,
      'User not found',
    ).then((profile) => ({ user_id: userId, ...profile }));
  }

  private getCategory(categoryId: string) {
    const url = `${this.gameServiceUrl}/categories/${encodeURIComponent(
      categoryId,
    )}`;

    return fetchServiceJson<ServiceCategory>(url, 'Category not found');
  }

  private async getUsersById(userIds: string[]) {
    const uniqueUserIds = [...new Set(userIds)];

    if (!uniqueUserIds.length) {
      return new Map<string, ServiceUser>();
    }

    const users = await Promise.all(
      uniqueUserIds.map((userId) => this.getUser(userId)),
    );

    return new Map(users.map((user) => [user.user_id, user]));
  }

  private async getCategoriesById(categoryIds: string[]) {
    const uniqueCategoryIds = [...new Set(categoryIds)];

    if (!uniqueCategoryIds.length) {
      return new Map<string, ServiceCategory>();
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
      this.serializeRun(run, usersById.get(run.user_id), category),
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

    return this.serializeRun({ ...run, comments }, user, runCategory);
  }

  async getByUser(userId: string, authUser: any) {
    const isSelf = userId === authUser.user_id;
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
      this.serializeRun(run, user, categoriesById.get(run.run_category_id)),
    );
  }

  async create(dto: CreateRunDto, user: any) {
    await this.ensureCategoryExists(dto.run_category_id);

    const createdRun = await this.prisma.runs.create({
      data: {
        run_id: uuidv4(),
        user_id: user.user_id,
        run_category_id: dto.run_category_id,
        vod_url: dto.vod_url,
        run_duration: BigInt(dto.run_duration),
        submitted_at: new Date(),
        status: 'PENDING',
      },
    });

    return {
      message: 'Run submitted successfully',
      run: this.serializeRun(createdRun),
    };
  }

  async getByStatus(status: string) {
    const normalizedStatus = status.toUpperCase();

    if (!['PENDING', 'ACCEPTED', 'REJECTED'].includes(normalizedStatus)) {
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
      this.serializeRun(
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
      run: this.serializeRun(updatedRun),
    };
  }
}
