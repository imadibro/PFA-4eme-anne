import { IsOptional, IsString } from 'class-validator';

export class UpdateRestaurantPayload {
  @IsString({ message: 'Le type de cuisine doit être une chaîne de caractères.' })
  @IsOptional()
  typeCuisin?: string;

  @IsString({ message: 'L\'horaire doit être une chaîne de caractères.' })
  @IsOptional()
  horaire?: string;
}
