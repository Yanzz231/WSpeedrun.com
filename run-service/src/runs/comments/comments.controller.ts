import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@ApiTags('Comments')
@ApiBearerAuth()
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a comment on a run' })
  @ApiBody({ type: CreateCommentDto })
  @ApiCreatedResponse({ description: 'Comment created successfully.' })
  @ApiBadRequestResponse({ description: 'User ID must match the token user.' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token.' })
  @ApiNotFoundResponse({ description: 'Run or user not found.' })
  create(@Body() dto: CreateCommentDto, @Req() req) {
    return this.commentsService.create(dto, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a comment' })
  @ApiParam({ name: 'id', description: 'Comment ID' })
  @ApiOkResponse({ description: 'Comment deleted successfully.' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token.' })
  @ApiForbiddenResponse({
    description: 'Only the comment owner can delete it.',
  })
  @ApiNotFoundResponse({ description: 'Comment not found.' })
  delete(@Param('id') id: string, @Req() req) {
    return this.commentsService.delete(id, req.user);
  }
}
