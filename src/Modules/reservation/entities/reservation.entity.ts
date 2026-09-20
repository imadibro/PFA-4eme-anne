import { CURRENT_TIMESTAMP } from 'src/common/constants/constant';
import { StatutReservation, TypeReservation } from 'src/common/enums';
import { Guide } from 'src/Modules/guide/entities/guide.entity';
import { Restaurant } from 'src/Modules/restaurant/entities/restaurant.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Chambre } from '../../chambre/entities/chambre.entity';
import { PackVoyage } from '../../pack-voyage/entities/pack-voyage.entity';
import { Prestataire } from '../../prestataire/entities/prestataire.entity';
import { Touriste } from '../../touriste/entities/touriste.entity';
import { Transport } from '../../transport/entities/transport.entity';

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 30 })
  codeReservation: string;

  @Column({ type: 'enum', enum: TypeReservation })
  typeReservation: TypeReservation;

  @Column({ type: 'date' })
  dateReservation: Date;

  @Column({ type: 'date' })
  dateDebut: Date;

  @Column({ type: 'date' })
  dateFin: Date;

  @Column({ type: 'double precision' })
  montant: number;

  @Column({ type: 'enum', enum: StatutReservation, default: StatutReservation.EN_ATTENTE })
  statut: StatutReservation;

  @ManyToOne(() => Touriste, t => t.reservations, { onDelete: 'CASCADE' })
  touriste: Touriste;

  @ManyToOne(() => Prestataire, p => p.reservations, { onDelete: 'CASCADE' })
  prestataire: Prestataire;

  // Cibles polymorphes
  @ManyToOne(() => Chambre, { nullable: true, onDelete: 'SET NULL' })
  chambre: Chambre;

  @ManyToOne(() => Transport, { nullable: true, onDelete: 'SET NULL' })
  transport: Transport;

  @ManyToOne(() => PackVoyage, { nullable: true, onDelete: 'SET NULL' })
  packVoyage: PackVoyage;

  @ManyToOne(() => Restaurant, { nullable: true, onDelete: 'SET NULL' })
  restaurant: Restaurant;

  @ManyToOne(() => Guide, { nullable: true, onDelete: 'SET NULL' })
  guide: Guide;

  @Column({ type: 'int', default: 1 })
  nbPersonnes: number;

  @Column({ type: 'text', nullable: true })
  commentairesSpecial: string;

  @CreateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => CURRENT_TIMESTAMP,
    onUpdate: CURRENT_TIMESTAMP
  })
  updatedAt: Date;
}
