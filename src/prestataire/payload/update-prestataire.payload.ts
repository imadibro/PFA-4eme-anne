import { IsOptional, IsString } from 'class-validator';

export class UpdatePrestatairePayload {
  @IsString({ message: "Le nom de l'entreprise doit être une chaîne de caractères." })
  @IsOptional()
  nomEntreprise?: string;

  @IsString({ message: "L'adresse doit être une chaîne de caractères." })
  @IsOptional()
  adress?: string;

  @IsString({ message: 'La ville doit être une chaîne de caractères.' })
  @IsOptional()
  ville?: string;

  @IsString({ message: 'La localisation doit être une chaîne de caractères.' })
  @IsOptional()
  localisation?: string;
}
