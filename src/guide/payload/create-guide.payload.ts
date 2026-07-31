import { IsArray, IsNotEmpty, IsNumber, IsPositive, IsString, IsUUID } from 'class-validator';

export class CreateGuidePayload {
  @IsNotEmpty({ message: "L'ID prestataire est requis." })
  @IsUUID(undefined, { message: "L'ID prestataire doit être un UUID valide." })
  prestataireId: string;

  @IsNotEmpty({ message: 'La liste des langues est requise.' })
  @IsArray({ message: 'La liste des langues doit être un tableau.' })
  @IsString({ each: true, message: 'Chaque langue doit être une chaîne de caractères.' })
  listLangues: string[];

  @IsNotEmpty({ message: 'Le tarif journalier est requis.' })
  @IsNumber({}, { message: 'Le tarif journalier doit être un nombre.' })
  @IsPositive({ message: 'Le tarif journalier doit être positif.' })
  tarifJrs: number;
}
