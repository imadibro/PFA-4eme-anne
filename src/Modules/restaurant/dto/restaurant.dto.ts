import { Restaurant } from '../entities/restaurant.entity';

export class RestaurantDto {
  constructor(restaurant: Restaurant) {
    this.id = restaurant.id;
    this.prestataireId = restaurant.prestataire?.id;
    this.typeCuisin = restaurant.typeCuisin;
    this.horaire = restaurant.horaire;
  }

  id: string;
  prestataireId: string;
  typeCuisin: string;
  horaire: string;
}
