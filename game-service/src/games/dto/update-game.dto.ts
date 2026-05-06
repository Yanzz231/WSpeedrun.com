import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateGameDto {
  @ApiPropertyOptional({ example: 'Celeste' })
  @IsOptional()
  @IsNotEmpty()
  game_name?: string;

  @ApiPropertyOptional({ example: 'A precision platformer speedrun title.' })
  @IsOptional()
  @IsNotEmpty()
  description?: string;
}
