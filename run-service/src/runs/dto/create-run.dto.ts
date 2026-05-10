import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateRunDto {
  @ApiProperty({ example: '6f33dc11-4d74-4d26-89aa-b8284e4b5974' })
  @IsNotEmpty()
  run_category_id: string;

  @ApiProperty({ example: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' })
  @IsNotEmpty()
  vod_url: string;

  @ApiProperty({ example: 3723, description: 'Run duration in seconds.' })
  @IsNumber()
  run_duration: number;
}
