import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { RegisterPayload } from './register-payload';

export class TouristeInfoPayload {
  @IsNotEmpty({ message: 'La nationalité est requise.' })
  nationality: string;

  @IsNotEmpty({ message: 'La date de naissance est requise.' })
  dateNaissance: string;
}

export class PrestataireInfoPayload {
  @IsNotEmpty({ message: "Le nom de l'entreprise est requis." })
  nomEntreprise: string;

  @IsNotEmpty({ message: "L'adresse est requise." })
  adress: string;

  @IsNotEmpty({ message: 'La ville est requise.' })
  ville: string;

  @IsNotEmpty({ message: 'La localisation est requise.' })
  localisation: string;

  @IsNotEmpty({ message: 'Les catégories sont requises.' })
  categories: string[];

  @IsOptional()
  description?: string;
}

export class HotelInfoPayload {
  @IsNotEmpty({ message: "Le nombre d'étoiles est requis." })
  nbrEtoiles: number;

  @IsNotEmpty({ message: 'Les équipements sont requis.' })
  equipements: string[];
}

export class CompleteRegistrationPayload {
  @ValidateNested()
  @Type(() => RegisterPayload)
  @IsNotEmpty({ message: 'Les informations utilisateur sont requises.' })
  userInfo: RegisterPayload;

  // Données spécifiques au touriste (au moins un des deux doit être fourni)
  @ValidateNested()
  @Type(() => TouristeInfoPayload)
  @IsOptional()
  touristeInfo?: TouristeInfoPayload;

  // Données spécifiques au prestataire (au moins un des deux doit être fourni)
  @ValidateNested()
  @Type(() => PrestataireInfoPayload)
  @IsOptional()
  prestataireInfo?: PrestataireInfoPayload;
}
