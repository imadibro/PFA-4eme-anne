import { StatutReservation, TypeReservation } from 'src/common/enums';
import { Reservation } from '../entities/reservation.entity';

export class ReservationDto {
  constructor(reservation: Reservation) {
    this.id = reservation.id;
    this.codeReservation = reservation.codeReservation;
    this.typeReservation = reservation.typeReservation;
    this.touristeId = reservation.touriste?.id;
    this.prestataireId = reservation.prestataire?.id;
    this.dateReservation = reservation.dateReservation;
    this.dateDebut = reservation.dateDebut;
    this.dateFin = reservation.dateFin;
    this.montant = reservation.montant;
    this.statut = reservation.statut;
    this.chambreId = reservation.chambre?.id;
    this.transportId = reservation.transport?.id;
    this.packVoyageId = reservation.packVoyage?.id;
    this.restaurantId = reservation.restaurant?.id;
    this.guideId = reservation.guide?.id;
    this.nbPersonnes = reservation.nbPersonnes;
    this.commentairesSpecial = reservation.commentairesSpecial;
  }

  id: number;
  codeReservation: string;
  typeReservation: TypeReservation;
  touristeId: string;
  prestataireId: string;
  dateReservation: Date;
  dateDebut: Date;
  dateFin: Date;
  montant: number;
  statut: StatutReservation;
  chambreId?: number;
  transportId?: number;
  packVoyageId?: number;
  restaurantId?: string;
  guideId?: string;
  nbPersonnes: number;
  commentairesSpecial?: string;
}
