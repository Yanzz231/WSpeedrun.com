import { IsOptional } from 'class-validator';

export class UpdateGameDto {
  @IsOptional()
  game_name?: string;

  @IsOptional()
  description?: string;
}