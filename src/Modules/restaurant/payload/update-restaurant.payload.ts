import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateRestaurantPayload {
  @IsString({ message: 'Le type de cuisine doit être une chaîne de caractères.' })
  @IsOptional()
  typeCuisin?: string;

  @IsString({ message: "L'horaire doit être une chaîne de caractères." })
  @IsOptional()
  horaire?: string;

  @IsNumber({}, { message: 'La capacité de couverts doit être un nombre.' })
  @IsOptional()
  capaciteCouverts?: number;
}
