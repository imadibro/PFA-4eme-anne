import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { PackVoyage } from '../../pack-voyage/entities/pack-voyage.entity';
import { Prestataire } from '../../prestataire/entities/prestataire.entity';

@Entity()
export class AgenceVoyage extends Prestataire {
  @OneToOne(() => Prestataire, { eager: true })
  @JoinColumn()
  prestataire: Prestataire;

  @Column()
  numLicence: string;

  @OneToMany(() => PackVoyage, (pack) => pack.agenceVoyage)
  packs: PackVoyage[];
}
