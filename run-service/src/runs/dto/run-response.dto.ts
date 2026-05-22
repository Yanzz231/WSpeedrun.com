export type ServiceUserDto = {
  user_id: string;
  username: string;
  email: string;
  country: string;
  role: string;
};

export type ServiceCategoryDto = {
  run_category_id: string;
  game_id: string;
  run_category_name: string;
  game?: {
    game_id: string;
    game_name: string;
    description: string;
  };
};
