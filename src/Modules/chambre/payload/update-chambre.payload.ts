import { IsBoolean, IsEnum, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { TypeChambre } from '../../../common/enums';

export class UpdateChambrePayload {
  @IsString({ message: 'Le numéro de chambre doit être une chaîne de caractères.' })
  @IsOptional()
  numero?: string;

  @IsEnum(TypeChambre, { message: 'Le type de chambre doit être valide.' })
  @IsOptional()
  type?: TypeChambre;

  @IsNumber({}, { message: 'Le prix par nuit doit être un nombre.' })
  @IsPositive({ message: 'Le prix par nuit doit être positif.' })
  @IsOptional()
  prixNuit?: number;

  @IsBoolean({ message: 'La disponibilité doit être un booléen.' })
  @IsOptional()
  estDisponible?: boolean;
}
