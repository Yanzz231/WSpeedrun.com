import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: '4fbd5b8d-7b4c-4d5f-a44d-14d270f2c981' })
  @IsNotEmpty()
  game_id: string;

  @ApiProperty({ example: 'Any%' })
  @IsNotEmpty()
  run_category_name: string;
}
