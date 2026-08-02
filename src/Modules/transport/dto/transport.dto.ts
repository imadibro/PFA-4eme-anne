import { TypeTransport } from '../../common/enums';
import { Transport } from '../entities/transport.entity';

export class TransportDto {
  constructor(transport: Transport) {
    this.id = transport.id;
    this.agenceVoyageId = transport.agenceVoyage?.id;
    this.type = transport.type;
    this.capacite = transport.capacite;
    this.prixJr = transport.prixJr;
  }

  id: number;
  agenceVoyageId: string;
  type: TypeTransport;
  capacite: number;
  prixJr: number;
}
