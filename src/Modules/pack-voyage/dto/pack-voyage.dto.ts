import { TypePack } from '../../../common/enums';
import { PackVoyage } from '../entities/pack-voyage.entity';

export class PackVoyageDto {
  constructor(pack: PackVoyage) {
    this.id = pack.id;
    this.agenceVoyageId = pack.agenceVoyage?.id;
    this.nom = pack.nom;
    this.description = pack.description;
    this.prix = pack.prix;
    this.typePack = pack.typePack;
    this.guideIds = pack.guides?.map(g => g.id) || [];
    this.hotelIds = pack.hotels?.map(h => h.id) || [];
    this.restaurantIds = pack.restaurants?.map(r => r.id) || [];
    this.transportIds = pack.transports?.map(t => t.id) || [];
    this.circuitId = pack.circuit?.id;
  }

  id: number;
  agenceVoyageId: string;
  nom: string;
  description: string;
  prix: number;
  typePack: TypePack;
  guideIds: string[];
  hotelIds: string[];
  restaurantIds: string[];
  transportIds: number[];
  circuitId?: number;
}
