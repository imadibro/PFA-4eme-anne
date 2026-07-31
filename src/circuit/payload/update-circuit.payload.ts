import { IsInt, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class UpdateCircuitPayload {
  @IsString({ message: 'Le titre doit être une chaîne de caractères.' })
  @IsOptional()
  title?: string;

  @IsNumber({}, { message: 'Le prix doit être un nombre.' })
  @IsPositive({ message: 'Le prix doit être positif.' })
  @IsOptional()
  prix?: number;

  @IsInt({ message: 'La durée en jours doit être un entier.' })
  @IsPositive({ message: 'La durée en jours doit être positive.' })
  @IsOptional()
  dureeJours?: number;
}
