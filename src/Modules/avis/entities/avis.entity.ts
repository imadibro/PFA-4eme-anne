import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Prestataire } from '../../prestataire/entities/prestataire.entity';
import { Touriste } from '../../touriste/entities/touriste.entity';

@Entity()
export class Avis {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  note: number;

  @Column()
  commentaire: string;

  @Column({ type: 'date' })
  dateAvis: Date;

  @ManyToOne(() => Touriste, t => t.avis, { onDelete: 'CASCADE' })
  touriste: Touriste;

  @ManyToOne(() => Prestataire, p => p.avis, { onDelete: 'CASCADE' })
  prestataire: Prestataire;
}
