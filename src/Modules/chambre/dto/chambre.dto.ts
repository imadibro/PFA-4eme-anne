import { TypeChambre } from '../../../common/enums';
import { Chambre } from '../entities/chambre.entity';

export class ChambreDto {
  constructor(chambre: Chambre) {
    this.id = chambre.id;
    this.hotelId = chambre.hotel?.id;
    this.numero = chambre.numero;
    this.type = chambre.type;
    this.prixNuit = chambre.prixNuit;
    this.capacite = chambre.capacite;
    this.nom = chambre.nom;
    this.estActifPourReservation = chambre.estActifPourReservation;
    this.photos = chambre.photos;
  }

  id: number;
  hotelId: string;
  numero: string;
  type: TypeChambre;
  prixNuit: number;
  capacite: number;
  nom: string;
  estActifPourReservation: boolean;
  photos: string[];
}
