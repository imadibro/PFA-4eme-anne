import { Hotel } from '../entities/hotel.entity';

export class HotelDto {
  constructor(hotel: Hotel) {
    this.id = hotel.id;
    this.prestataireId = hotel.prestataire?.id;
    this.nbrChambre = hotel.nbrChambre;
    this.nbrEtoiles = hotel.nbrEtoiles;
  }

  id: string;
  prestataireId: string;
  nbrChambre: number;
  nbrEtoiles: number;
}
