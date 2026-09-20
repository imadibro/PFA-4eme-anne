import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID
} from 'class-validator';
import { TypeChambre } from '../../../common/enums';

export class CreateChambrePayload {
  @IsNotEmpty({ message: "L'ID hôtel est requis." })
  @IsUUID(undefined, { message: "L'ID hôtel doit être un UUID valide." })
  hotelId: string;

  @IsNotEmpty({ message: 'Le numéro de chambre est requis.' })
  @IsString({ message: 'Le numéro de chambre doit être une chaîne de caractères.' })
  numero: string;

  @IsNotEmpty({ message: 'Le nom de la chambre est requis.' })
  @IsString({ message: 'Le nom de la chambre doit être une chaîne de caractères.' })
  nom: string;

  @IsNotEmpty({ message: 'Le type de chambre est requis.' })
  @IsEnum(TypeChambre, { message: 'Le type de chambre doit être valide.' })
  type: TypeChambre;

  @IsNotEmpty({ message: 'Le prix par nuit est requis.' })
  @IsNumber({}, { message: 'Le prix par nuit doit être un nombre.' })
  @IsPositive({ message: 'Le prix par nuit doit être positif.' })
  prixNuit: number;

  @IsNotEmpty({ message: 'La capacité de la chambre est requise.' })
  @IsNumber({}, { message: 'La capacité de la chambre doit être un nombre.' })
  @IsPositive({ message: 'La capacité de la chambre doit être positive.' })
  capacite: number;

  @IsNotEmpty({ message: 'Les photos de la chambre sont requises.' })
  @IsArray({ message: 'Les photos de la chambre doivent être un tableau.' })
  photos: string[];

  @IsBoolean({ message: 'La disponibilité doit être un booléen.' })
  @IsOptional()
  estActifPourReservation?: boolean;
}
