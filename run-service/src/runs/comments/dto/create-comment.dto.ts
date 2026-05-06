import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ example: '535d4b84-91ad-41a0-bbfb-f73029a6eccc' })
  @IsNotEmpty()
  run_id: string;

  @ApiProperty({ example: '08ea5372-08a9-4696-8ad5-4c2a0fcd3e0e' })
  @IsNotEmpty()
  user_id: string;

  @ApiProperty({ example: 'Clean route, nice run.' })
  @IsNotEmpty()
  comment: string;
}
