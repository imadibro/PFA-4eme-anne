import { IsDateString, IsInt, IsNotEmpty, IsString, IsUUID, Max, Min } from 'class-validator';

export class CreateAvisPayload {
  @IsNotEmpty({ message: "L'ID touriste est requis." })
  @IsUUID(undefined, { message: "L'ID touriste doit être un UUID valide." })
  touristeId: string;

  @IsNotEmpty({ message: "L'ID prestataire est requis." })
  @IsUUID(undefined, { message: "L'ID prestataire doit être un UUID valide." })
  prestataireId: string;

  @IsNotEmpty({ message: 'La note est requise.' })
  @IsInt({ message: 'La note doit être un entier.' })
  @Min(1, { message: 'La note doit être au minimum 1.' })
  @Max(5, { message: 'La note doit être au maximum 5.' })
  note: number;

  @IsNotEmpty({ message: 'Le commentaire est requis.' })
  @IsString({ message: 'Le commentaire doit être une chaîne de caractères.' })
  commentaire: string;

  @IsNotEmpty({ message: "La date de l'avis est requise." })
  @IsDateString({}, { message: "La date de l'avis doit être une date valide." })
  dateAvis: string;
}
