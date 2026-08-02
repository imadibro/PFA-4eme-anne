import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID
} from 'class-validator';
import { TypePack } from '../../common/enums';

export class CreatePackVoyagePayload {
  @IsNotEmpty({ message: "L'ID agence de voyage est requis." })
  @IsUUID(undefined, { message: "L'ID agence de voyage doit être un UUID valide." })
  agenceVoyageId: string;

  @IsNotEmpty({ message: 'Le nom du pack est requis.' })
  @IsString({ message: 'Le nom du pack doit être une chaîne de caractères.' })
  nom: string;

  @IsNotEmpty({ message: 'La description est requise.' })
  @IsString({ message: 'La description doit être une chaîne de caractères.' })
  description: string;

  @IsNotEmpty({ message: 'Le prix est requis.' })
  @IsNumber({}, { message: 'Le prix doit être un nombre.' })
  @IsPositive({ message: 'Le prix doit être positif.' })
  prix: number;

  @IsNotEmpty({ message: 'Le type de pack est requis.' })
  @IsEnum(TypePack, { message: 'Le type de pack doit être valide.' })
  typePack: TypePack;

  @IsArray({ message: 'Les IDs guides doivent être un tableau.' })
  @IsUUID(undefined, { each: true, message: 'Chaque ID guide doit être un UUID valide.' })
  @IsOptional()
  guideIds?: string[];

  @IsArray({ message: 'Les IDs hôtels doivent être un tableau.' })
  @IsUUID(undefined, { each: true, message: 'Chaque ID hôtel doit être un UUID valide.' })
  @IsOptional()
  hotelIds?: string[];

  @IsArray({ message: 'Les IDs restaurants doivent être un tableau.' })
  @IsUUID(undefined, { each: true, message: 'Chaque ID restaurant doit être un UUID valide.' })
  @IsOptional()
  restaurantIds?: string[];

  @IsArray({ message: 'Les IDs transports doivent être un tableau.' })
  @IsInt({ each: true, message: 'Chaque ID transport doit être un entier.' })
  @IsOptional()
  transportIds?: number[];

  @IsInt({ message: "L'ID circuit doit être un entier." })
  @IsOptional()
  circuitId?: number;
}
