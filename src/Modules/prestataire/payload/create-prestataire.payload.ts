import { ArrayNotEmpty, IsArray, IsIn, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { PRESTATAIRE_CATEGORIES } from 'src/common';

export class CreatePrestatairePayload {
  @IsNotEmpty({ message: "L'ID utilisateur est requis." })
  @IsUUID(undefined, { message: "L'ID utilisateur doit être un UUID valide." })
  userId: string;

  @IsNotEmpty({ message: "Le nom de l'entreprise est requis." })
  @IsString({ message: "Le nom de l'entreprise doit être une chaîne de caractères." })
  nomEntreprise: string;

  @IsNotEmpty({ message: "L'adresse est requise." })
  @IsString({ message: "L'adresse doit être une chaîne de caractères." })
  adress: string;

  @IsNotEmpty({ message: 'La ville est requise.' })
  @IsString({ message: 'La ville doit être une chaîne de caractères.' })
  ville: string;

  @IsNotEmpty({ message: 'La localisation est requise.' })
  @IsString({ message: 'La localisation doit être une chaîne de caractères.' })
  localisation: string;

  @IsNotEmpty({ message: 'Les catégories sont requises.' })
  @IsArray({ message: 'Les catégories doivent être un tableau.' })
  @ArrayNotEmpty({ message: 'Au moins une catégorie est requise.' })
  @IsIn(Object.values(PRESTATAIRE_CATEGORIES), {
    each: true,
    message: 'Chaque catégorie doit être valide (hotel, restaurant, guide, transport, agence_voyage).'
  })
  categories: string[];

  @IsString({ message: 'La description doit être une chaîne de caractères.' })
  @IsOptional()
  description?: string;
}
