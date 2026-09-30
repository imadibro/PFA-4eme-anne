import { IsArray, IsIn, IsOptional, IsString } from 'class-validator';
import { PRESTATAIRE_CATEGORIES } from 'src/common';

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

  @IsString({ message: 'La description doit être une chaîne de caractères.' })
  @IsOptional()
  description?: string;

  @IsArray({ message: 'Les catégories doivent être un tableau.' })
  @IsIn(Object.values(PRESTATAIRE_CATEGORIES), {
    each: true,
    message: 'Chaque catégorie doit être valide (hotel, restaurant, guide, transport, agence_voyage).'
  })
  @IsOptional()
  categories?: string[];
}
