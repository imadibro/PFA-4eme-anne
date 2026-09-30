import { UserDto } from '../../user/dto/userDto';
import { Prestataire } from '../entities/prestataire.entity';

export class PrestataireDto {
  constructor(prestataire: Prestataire) {
    this.id = prestataire.id;
    this.user = prestataire.user ? new UserDto(prestataire.user) : null;
    this.nomEntreprise = prestataire.nomEntreprise;
    this.adress = prestataire.adress;
    this.ville = prestataire.ville;
    this.localisation = prestataire.localisation;
    this.description = prestataire.description;
    this.nombreAvis = prestataire.nombreAvis;
    this.categories = prestataire.categories;
  }

  id: string;
  user: UserDto | null;
  nomEntreprise: string;
  adress: string;
  ville: string;
  localisation: string;
  description: string;
  nombreAvis: number;
  categories: string[];
}
