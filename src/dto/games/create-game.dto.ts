import { IsNotEmpty } from 'class-validator';

export class CreateGameDto {
  @IsNotEmpty()
  game_name: string;

  @IsNotEmpty()
  description: string;
}