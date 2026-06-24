import { Column, Entity, OneToMany } from 'typeorm';
import { Avis } from '../../avis/entities/avis.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
export abstract class Prestataire extends User {
  @Column()
  nomEntreprise: string;

  @Column()
  adress: string;

  @Column()
  ville: string;

  @Column()
  localisation: string;

  @OneToMany(() => Avis, (avis) => avis.prestataire)
  avis: Avis[];
}
