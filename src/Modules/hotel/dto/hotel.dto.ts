import { Hotel } from '../entities/hotel.entity';

export class HotelDto {
  constructor(hotel: Hotel) {
    this.id = hotel.id;
    this.prestataireId = hotel.prestataire?.id;
    this.equipements = hotel.equipements;
    this.nbrEtoiles = hotel.nbrEtoiles;
  }

  id: string;
  prestataireId: string;
  equipements: string[];
  nbrEtoiles: number;
}
