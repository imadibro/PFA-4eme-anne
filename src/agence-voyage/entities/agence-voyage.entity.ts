import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PackVoyage } from '../../pack-voyage/entities/pack-voyage.entity';
import { Prestataire } from '../../prestataire/entities/prestataire.entity';
import { Transport } from '../../transport/entities/transport.entity';

// agence-voyage.entity.ts
@Entity('agences_voyage')
export class AgenceVoyage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Prestataire, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'prestataire_id' })
  prestataire: Prestataire;

  @Column({ name: 'num_licence' })
  numLicence: string;

  @OneToMany(() => PackVoyage, pack => pack.agenceVoyage)
  packs: PackVoyage[];

  @OneToMany(() => Transport, t => t.agenceVoyage)
  transports: Transport[];
}
