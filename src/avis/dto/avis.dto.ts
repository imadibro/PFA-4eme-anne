import { Avis } from '../entities/avis.entity';

export class AvisDto {
  constructor(avis: Avis) {
    this.id = avis.id;
    this.touristeId = avis.touriste?.id;
    this.prestataireId = avis.prestataire?.id;
    this.note = avis.note;
    this.commentaire = avis.commentaire;
    this.dateAvis = avis.dateAvis;
  }

  id: number;
  touristeId: string;
  prestataireId: string;
  note: number;
  commentaire: string;
  dateAvis: Date;
}
