import { IsArray, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class UpdateGuidePayload {
  @IsArray({ message: 'La liste des langues doit être un tableau.' })
  @IsString({ each: true, message: 'Chaque langue doit être une chaîne de caractères.' })
  @IsOptional()
  listLangues?: string[];

  @IsNumber({}, { message: 'Le tarif journalier doit être un nombre.' })
  @IsPositive({ message: 'Le tarif journalier doit être positif.' })
  @IsOptional()
  tarifJrs?: number;
}
