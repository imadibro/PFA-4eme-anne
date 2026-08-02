import { StatutReservation } from '../../common/enums';
import { Reservation } from '../entities/reservation.entity';

export class ReservationDto {
  constructor(reservation: Reservation) {
    this.id = reservation.id;
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
  }

  id: number;
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
}
