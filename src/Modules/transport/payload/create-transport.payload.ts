import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsPositive, IsUUID } from 'class-validator';
import { TypeTransport } from 'src/common/enums';

export class CreateTransportPayload {
  @IsNotEmpty({ message: "L'ID agence de voyage est requis." })
  @IsUUID(undefined, { message: "L'ID agence de voyage doit être un UUID valide." })
  agenceVoyageId: string;

  @IsNotEmpty({ message: 'Le type de transport est requis.' })
  @IsEnum(TypeTransport, { message: 'Le type de transport doit être valide.' })
  type: TypeTransport;

  @IsNotEmpty({ message: 'La capacité est requise.' })
  @IsInt({ message: 'La capacité doit être un entier.' })
  @IsPositive({ message: 'La capacité doit être positive.' })
  capacite: number;

  @IsNotEmpty({ message: 'Le prix journalier est requis.' })
  @IsNumber({}, { message: 'Le prix journalier doit être un nombre.' })
  @IsPositive({ message: 'Le prix journalier doit être positif.' })
  prixJr: number;
}
