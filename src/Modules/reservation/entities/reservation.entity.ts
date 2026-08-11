import { StatutReservation } from 'src/common/enums';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Chambre } from '../../chambre/entities/chambre.entity';
import { PackVoyage } from '../../pack-voyage/entities/pack-voyage.entity';
import { Prestataire } from '../../prestataire/entities/prestataire.entity';
import { Touriste } from '../../touriste/entities/touriste.entity';
import { Transport } from '../../transport/entities/transport.entity';

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

  @ManyToOne(() => Touriste, touriste => touriste.reservations)
  touriste: Touriste;

  @ManyToOne(() => Prestataire, prestataire => prestataire.reservations)
  prestataire: Prestataire;

  @ManyToOne(() => Chambre, { nullable: true })
  chambre: Chambre;

  @ManyToOne(() => Transport, { nullable: true })
  transport: Transport;

  @ManyToOne(() => PackVoyage, { nullable: true })
  packVoyage: PackVoyage;
}
