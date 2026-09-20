import { IsDateString, IsEnum, IsInt, IsNumber, IsOptional, IsPositive, IsString, IsUUID } from 'class-validator';
import { StatutReservation, TypeReservation } from 'src/common/enums';

export class UpdateReservationPayload {
  @IsEnum(TypeReservation, { message: 'Le type de réservation doit être valide.' })
  @IsOptional()
  typeReservation?: TypeReservation;

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

  @IsUUID(undefined, { message: "L'ID restaurant doit être un UUID valide." })
  @IsOptional()
  restaurantId?: string;

  @IsUUID(undefined, { message: "L'ID guide doit être un UUID valide." })
  @IsOptional()
  guideId?: string;

  @IsInt({ message: 'Le nombre de personnes doit être un entier.' })
  @IsPositive({ message: 'Le nombre de personnes doit être positif.' })
  @IsOptional()
  nbPersonnes?: number;

  @IsString({ message: 'Les commentaires spéciaux doivent être une chaîne de caractères.' })
  @IsOptional()
  commentairesSpecial?: string;
}
