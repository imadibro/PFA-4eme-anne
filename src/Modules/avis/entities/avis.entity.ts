import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Touriste } from '../../touriste/entities/touriste.entity';
import { Prestataire } from '../../prestataire/entities/prestataire.entity';

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

  @ManyToOne(() => Touriste, (touriste) => touriste.avis)
  touriste: Touriste;

  @ManyToOne(() => Prestataire, (prestataire) => prestataire.avis)
  prestataire: Prestataire;
}
