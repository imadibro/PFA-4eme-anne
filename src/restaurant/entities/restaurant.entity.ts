import { Column, Entity } from 'typeorm';
import { Prestataire } from '../../prestataire/entities/prestataire.entity';

@Entity()
export class Restaurant extends Prestataire {
  @Column()
  typeCuisin: string;

  @Column()
  horaire: string;


}
