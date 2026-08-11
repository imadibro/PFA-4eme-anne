import { IsDateString, IsEnum, IsInt, IsNumber, IsOptional, IsPositive } from 'class-validator';
import { StatutReservation } from 'src/common/enums';

export class UpdateReservationPayload {
  @IsDateString({}, { message: 'La date de réservation doit être une date valide.' })
  @IsOptional()
  dateReservation?: string;

  @IsDateString({}, { message: 'La date de début doit être une date valide.' })
  @IsOptional()
  dateDebut?: string;

  @IsDateString({}, { message: 'La date de fin doit être une date valide.' })
  @IsOptional()
  dateFin?: string;

  @IsNumber({}, { message: 'Le montant doit être un nombre.' })
  @IsPositive({ message: 'Le montant doit être positif.' })
  @IsOptional()
  montant?: number;

  @IsEnum(StatutReservation, { message: 'Le statut doit être valide.' })
  @IsOptional()
  statut?: StatutReservation;

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
