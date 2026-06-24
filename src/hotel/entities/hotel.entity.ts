import { Column, Entity, OneToMany } from 'typeorm';
import { Chambre } from '../../chambre/entities/chambre.entity';
import { Prestataire } from '../../prestataire/entities/prestataire.entity';

@Entity()
export class Hotel extends Prestataire {
  @Column()
  nbrChambre: number;

  @Column()
  nbrEtoiles: number;

  @OneToMany(() => Chambre, (chambre) => chambre.hotel)
  chambres: Chambre[];
}
