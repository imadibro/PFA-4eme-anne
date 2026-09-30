import { CURRENT_TIMESTAMP } from 'src/common/constants/constant';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { AgenceVoyage } from '../../agence-voyage/entities/agence-voyage.entity';
import { Avis } from '../../avis/entities/avis.entity';
import { Guide } from '../../guide/entities/guide.entity';
import { Hotel } from '../../hotel/entities/hotel.entity';
import { Reservation } from '../../reservation/entities/reservation.entity';
import { Restaurant } from '../../restaurant/entities/restaurant.entity';
import { User } from '../../user/entities/user.entity';

@Entity('prestataires')
export abstract class Prestataire {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, { eager: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  nomEntreprise: string;

  @Column()
  adress: string;

  @Column()
  ville: string;

  @Column()
  localisation: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'int', default: 0 })
  nombreAvis: number;

  @Column('simple-array', { name: 'categories', nullable: true })
  categories: string[];

  @OneToMany(() => Hotel, h => h.prestataire)
  hotels: Hotel[];

  @OneToMany(() => Restaurant, r => r.prestataire)
  restaurants: Restaurant[];

  @OneToMany(() => Guide, g => g.prestataire)
  guides: Guide[];

  @OneToMany(() => AgenceVoyage, a => a.prestataire)
  agences: AgenceVoyage[];

  @OneToMany(() => Avis, avis => avis.prestataire)
  avis: Avis[];

  @OneToMany(() => Reservation, reservation => reservation.prestataire)
  reservations: Reservation[];

  @CreateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => CURRENT_TIMESTAMP,
    onUpdate: CURRENT_TIMESTAMP
  })
  updatedAt: Date;
}
