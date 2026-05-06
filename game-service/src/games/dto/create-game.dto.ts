import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateGameDto {
  @ApiProperty({ example: 'Celeste' })
  @IsNotEmpty()
  game_name: string;

  @ApiProperty({ example: 'A precision platformer speedrun title.' })
  @IsNotEmpty()
  description: string;
}
