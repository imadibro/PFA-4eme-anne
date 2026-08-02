import { IsDateString, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class UpdateAvisPayload {
  @IsInt({ message: 'La note doit être un entier.' })
  @Min(1, { message: 'La note doit être au minimum 1.' })
  @Max(5, { message: 'La note doit être au maximum 5.' })
  @IsOptional()
  note?: number;

  @IsString({ message: 'Le commentaire doit être une chaîne de caractères.' })
  @IsOptional()
  commentaire?: string;

  @IsDateString({}, { message: "La date de l'avis doit être une date valide." })
  @IsOptional()
  dateAvis?: string;
}
