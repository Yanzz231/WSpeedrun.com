import { IsOptional } from 'class-validator';

export class UpdateCategoryDto {
    @IsOptional()
    game_id?: string;

    @IsOptional()
    run_category_name?: string;
}