import { IsDateString, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsUUID } from 'class-validator';
import { StatutReservation } from '../../common/enums';

export class CreateReservationPayload {
  @IsNotEmpty({ message: "L'ID touriste est requis." })
  @IsUUID(undefined, { message: "L'ID touriste doit être un UUID valide." })
  touristeId: string;

  @IsNotEmpty({ message: "L'ID prestataire est requis." })
  @IsUUID(undefined, { message: "L'ID prestataire doit être un UUID valide." })
  prestataireId: string;

  @IsNotEmpty({ message: 'La date de réservation est requise.' })
  @IsDateString({}, { message: 'La date de réservation doit être une date valide.' })
  dateReservation: string;

  @IsNotEmpty({ message: 'La date de début est requise.' })
  @IsDateString({}, { message: 'La date de début doit être une date valide.' })
  dateDebut: string;

  @IsNotEmpty({ message: 'La date de fin est requise.' })
  @IsDateString({}, { message: 'La date de fin doit être une date valide.' })
  dateFin: string;

  @IsNotEmpty({ message: 'Le montant est requis.' })
  @IsNumber({}, { message: 'Le montant doit être un nombre.' })
  @IsPositive({ message: 'Le montant doit être positif.' })
  montant: number;

  @IsNotEmpty({ message: 'Le statut est requis.' })
  @IsEnum(StatutReservation, { message: 'Le statut doit être valide.' })
  statut: StatutReservation;

  @IsInt({ message: "L'ID chambre doit être un entier." })
  @IsOptional()
  chambreId?: number;

  @IsInt({ message: "L'ID transport doit être un entier." })
  @IsOptional()
  transportId?: number;

  @IsInt({ message: "L'ID pack voyage doit être un entier." })
  @IsOptional()
  packVoyageId?: number;
}
