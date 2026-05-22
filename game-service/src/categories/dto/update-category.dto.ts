import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateCategoryDto {
  @ApiPropertyOptional({ example: '4fbd5b8d-7b4c-4d5f-a44d-14d270f2c981' })
  @IsOptional()
  @IsNotEmpty()
  game_id?: string;

  @ApiPropertyOptional({ example: '100%' })
  @IsOptional()
  @IsNotEmpty()
  run_category_name?: string;
}
