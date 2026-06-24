import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Touriste } from '../../touriste/entities/touriste.entity';
import { Prestataire } from '../../prestataire/entities/prestataire.entity';
import { StatutReservation } from '../../common/enums';

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  dateReservation: Date;

  @Column({ type: 'date' })
  dateDebut: Date;

  @Column({ type: 'date' })
  dateFin: Date;

  @Column({ type: 'double precision' })
  montant: number;

  @Column({ type: 'enum', enum: StatutReservation })
  statut: StatutReservation;

  @ManyToOne(() => Touriste, (touriste) => touriste.reservations)
  touriste: Touriste;

  @ManyToOne(() => Prestataire)
  prestataire: Prestataire;
}
