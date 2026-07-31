import { Guide } from '../entities/guide.entity';

export class GuideDto {
  constructor(guide: Guide) {
    this.id = guide.id;
    this.prestataireId = guide.prestataire?.id;
    this.listLangues = guide.listLangues;
    this.tarifJrs = guide.tarifJrs;
  }

  id: string;
  prestataireId: string;
  listLangues: string[];
  tarifJrs: number;
}
