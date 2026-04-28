import { IsNotEmpty } from 'class-validator';

export class CreateCategoryDto {
    @IsNotEmpty()
    game_id: string;

    @IsNotEmpty()
    run_category_name: string;
}