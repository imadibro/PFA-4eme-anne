import { IsInt, IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateCircuitPayload {
  @IsNotEmpty({ message: 'Le titre est requis.' })
  @IsString({ message: 'Le titre doit être une chaîne de caractères.' })
  title: string;

  @IsNotEmpty({ message: 'Le prix est requis.' })
  @IsNumber({}, { message: 'Le prix doit être un nombre.' })
  @IsPositive({ message: 'Le prix doit être positif.' })
  prix: number;

  @IsNotEmpty({ message: 'La durée en jours est requise.' })
  @IsInt({ message: 'La durée en jours doit être un entier.' })
  @IsPositive({ message: 'La durée en jours doit être positive.' })
  dureeJours: number;
}
