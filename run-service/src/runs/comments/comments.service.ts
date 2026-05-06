import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { fetchServiceJson } from '../../common/http/service-client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  private readonly authServiceUrl =
    process.env.AUTH_SERVICE_URL ?? 'http://localhost:3000';

  constructor(private prisma: PrismaService) {}

  private async ensureUserExists(userId: string) {
    await fetchServiceJson(
      `${this.authServiceUrl}/users/${encodeURIComponent(userId)}/profile`,
      'User not found',
    );
  }

  async create(dto: CreateCommentDto, user: any) {
    if (dto.user_id !== user.user_id) {
      throw new BadRequestException('User ID must match authenticated user');
    }

    const run = await this.prisma.runs.findUnique({
      where: { run_id: dto.run_id },
    });

    if (!run) throw new NotFoundException('Run not found');

    await this.ensureUserExists(dto.user_id);

    return this.prisma.comments.create({
      data: {
        comment_id: uuidv4(),
        run_id: dto.run_id,
        user_id: dto.user_id,
        comment: dto.comment,
        created_at: new Date(),
      },
    });
  }

  async delete(id: string, user: any) {
    const comment = await this.prisma.comments.findUnique({
      where: { comment_id: id },
    });

    if (!comment) throw new NotFoundException('Comment not found');

    if (comment.user_id !== user.user_id) {
      throw new ForbiddenException('Not your comment');
    }

    return this.prisma.comments.delete({
      where: { comment_id: id },
    });
  }
}
