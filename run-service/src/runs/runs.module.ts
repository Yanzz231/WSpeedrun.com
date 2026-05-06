import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AdminRunsController } from './admin/admin-runs.controller';
import { CommentsModule } from './comments/comments.module';
import { RunsController } from './runs.controller';
import { RunsService } from './runs.service';

@Module({
  imports: [PrismaModule, CommentsModule],
  controllers: [RunsController, AdminRunsController],
  providers: [RunsService],
})
export class RunsModule {}
