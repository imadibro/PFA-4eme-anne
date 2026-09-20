import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TypeChambre } from '../../../common/enums';
import { Hotel } from '../../hotel/entities/hotel.entity';

@Entity('chambres')
export class Chambre {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  numero: string;

  @Column()
  nom: string;

  @Column({ type: 'enum', enum: TypeChambre })
  type: TypeChambre;

  @Column({ default: 2 })
  capacite: number;

  @Column({ type: 'double precision' })
  prixNuit: number;

  // Règle d'or : ce flag sert uniquement à fermer administrativement la chambre
  // (ex: travaux). La disponibilité calendrier se calcule via Reservation !
  @Column({ default: true })
  estActifPourReservation: boolean;

  @Column('simple-array', { nullable: true })
  photos: string[];

  @ManyToOne(() => Hotel, h => h.chambres, { onDelete: 'CASCADE' })
  hotel: Hotel;
}
