import { IsEnum, IsInt, IsNumber, IsOptional, IsPositive } from 'class-validator';
import { TypeTransport } from '../../common/enums';

export class UpdateTransportPayload {
  @IsEnum(TypeTransport, { message: 'Le type de transport doit être valide.' })
  @IsOptional()
  type?: TypeTransport;

  @IsInt({ message: 'La capacité doit être un entier.' })
  @IsPositive({ message: 'La capacité doit être positive.' })
  @IsOptional()
  capacite?: number;

  @IsNumber({}, { message: 'Le prix journalier doit être un nombre.' })
  @IsPositive({ message: 'Le prix journalier doit être positif.' })
  @IsOptional()
  prixJr?: number;
}
