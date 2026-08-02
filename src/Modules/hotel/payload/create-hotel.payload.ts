import { IsInt, IsNotEmpty, IsPositive, IsUUID, Max, Min } from 'class-validator';

export class CreateHotelPayload {
  @IsNotEmpty({ message: "L'ID prestataire est requis." })
  @IsUUID(undefined, { message: "L'ID prestataire doit être un UUID valide." })
  prestataireId: string;

  @IsNotEmpty({ message: 'Le nombre de chambres est requis.' })
  @IsInt({ message: 'Le nombre de chambres doit être un entier.' })
  @IsPositive({ message: 'Le nombre de chambres doit être positif.' })
  nbrChambre: number;

  @IsNotEmpty({ message: 'Le nombre d\'étoiles est requis.' })
  @IsInt({ message: 'Le nombre d\'étoiles doit être un entier.' })
  @Min(1, { message: 'Le nombre d\'étoiles doit être au minimum 1.' })
  @Max(5, { message: 'Le nombre d\'étoiles doit être au maximum 5.' })
  nbrEtoiles: number;
}
