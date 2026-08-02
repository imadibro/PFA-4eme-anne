import { IsInt, IsOptional, IsPositive, Max, Min } from 'class-validator';

export class UpdateHotelPayload {
  @IsInt({ message: 'Le nombre de chambres doit être un entier.' })
  @IsPositive({ message: 'Le nombre de chambres doit être positif.' })
  @IsOptional()
  nbrChambre?: number;

  @IsInt({ message: 'Le nombre d\'étoiles doit être un entier.' })
  @Min(1, { message: 'Le nombre d\'étoiles doit être au minimum 1.' })
  @Max(5, { message: 'Le nombre d\'étoiles doit être au maximum 5.' })
  @IsOptional()
  nbrEtoiles?: number;
}
