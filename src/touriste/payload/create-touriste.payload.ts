import { IsDateString, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateTouristePayload {
  @IsNotEmpty({ message: "L'ID utilisateur est requis." })
  @IsUUID(undefined, { message: "L'ID utilisateur doit être un UUID valide." })
  userId: string;

  @IsNotEmpty({ message: 'La nationalité est requise.' })
  @IsString({ message: 'La nationalité doit être une chaîne de caractères.' })
  nationality: string;

  @IsNotEmpty({ message: 'La date de naissance est requise.' })
  @IsDateString({}, { message: 'La date de naissance doit être une date valide.' })
  dateNaissance: string;
}
