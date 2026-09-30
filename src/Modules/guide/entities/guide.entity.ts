import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Prestataire } from '../../prestataire/entities/prestataire.entity';

// guide.entity.ts
@Entity('guides')
export class Guide {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Prestataire, p => p.guides, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'prestataire_id' })
  prestataire: Prestataire;

  @Column('simple-array', { name: 'list_langues' })
  listLangues: string[];

  @Column({ name: 'tarif_jrs', type: 'double precision' })
  tarifJrs: number;
}
