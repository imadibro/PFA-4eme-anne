import { IsArray, IsEnum, IsInt, IsNumber, IsOptional, IsPositive, IsString, IsUUID } from 'class-validator';
import { TypePack } from '../../common/enums';

export class UpdatePackVoyagePayload {
  @IsString({ message: 'Le nom du pack doit être une chaîne de caractères.' })
  @IsOptional()
  nom?: string;

  @IsString({ message: 'La description doit être une chaîne de caractères.' })
  @IsOptional()
  description?: string;

  @IsNumber({}, { message: 'Le prix doit être un nombre.' })
  @IsPositive({ message: 'Le prix doit être positif.' })
  @IsOptional()
  prix?: number;

  @IsEnum(TypePack, { message: 'Le type de pack doit être valide.' })
  @IsOptional()
  typePack?: TypePack;

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
