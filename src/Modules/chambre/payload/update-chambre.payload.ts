import { IsArray, IsBoolean, IsEnum, IsInt, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { TypeChambre } from '../../../common/enums';

export class UpdateChambrePayload {
  @IsString({ message: 'Le numéro de chambre doit être une chaîne de caractères.' })
  @IsOptional()
  numero?: string;

  @IsString({ message: 'Le nom de la chambre doit être une chaîne de caractères.' })
  @IsOptional()
  nom?: string;

  @IsEnum(TypeChambre, { message: 'Le type de chambre doit être valide.' })
  @IsOptional()
  type?: TypeChambre;

  @IsNumber({}, { message: 'Le prix par nuit doit être un nombre.' })
  @IsPositive({ message: 'Le prix par nuit doit être positif.' })
  @IsOptional()
  prixNuit?: number;

  @IsInt({ message: 'La capacité doit être un entier.' })
  @IsPositive({ message: 'La capacité doit être positive.' })
  @IsOptional()
  capacite?: number;

  @IsBoolean({ message: "L'activation pour réservation doit être un booléen." })
  @IsOptional()
  estActifPourReservation?: boolean;

  @IsArray({ message: 'Les photos doivent être un tableau.' })
  @IsString({ each: true, message: 'Chaque photo doit être une chaîne de caractères.' })
  @IsOptional()
  photos?: string[];
}
