import { IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateTouristePayload {
  @IsString({ message: 'La nationalité doit être une chaîne de caractères.' })
  @IsOptional()
  nationality?: string;

  @IsDateString({}, { message: 'La date de naissance doit être une date valide.' })
  @IsOptional()
  dateNaissance?: string;
}
