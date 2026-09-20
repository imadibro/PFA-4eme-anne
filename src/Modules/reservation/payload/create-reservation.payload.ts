import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID
} from 'class-validator';
import { StatutReservation, TypeReservation } from 'src/common/enums';

export class CreateReservationPayload {
  @IsString({ message: 'Le code de réservation doit être une chaîne de caractères.' })
  @IsOptional()
  codeReservation?: string;

  @IsNotEmpty({ message: 'Le type de réservation est requis.' })
  @IsEnum(TypeReservation, { message: 'Le type de réservation doit être valide.' })
  typeReservation: TypeReservation;

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
