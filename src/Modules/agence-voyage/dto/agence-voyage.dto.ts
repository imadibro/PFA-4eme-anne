import { AgenceVoyage } from '../entities/agence-voyage.entity';

export class AgenceVoyageDto {
  constructor(agence: AgenceVoyage) {
    this.id = agence.id;
    this.prestataireId = agence.prestataire?.id;
    this.numLicence = agence.numLicence;
  }

  id: string;
  prestataireId: string;
  numLicence: string;
}
