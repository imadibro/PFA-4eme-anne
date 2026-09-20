import { IsArray, IsInt, IsOptional, Max, Min } from 'class-validator';

export class UpdateHotelPayload {
  @IsArray({ message: 'Les équipements doivent être un tableau.' })
  @IsOptional()
  equipements?: string[];

  @IsInt({ message: "Le nombre d'étoiles doit être un entier." })
  @Min(1, { message: "Le nombre d'étoiles doit être au minimum 1." })
  @Max(5, { message: "Le nombre d'étoiles doit être au maximum 5." })
  @IsOptional()
  nbrEtoiles?: number;
}
