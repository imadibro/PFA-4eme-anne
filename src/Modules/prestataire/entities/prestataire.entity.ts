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
import { Avis } from '../../avis/entities/avis.entity';
import { Reservation } from '../../reservation/entities/reservation.entity';
import { User } from '../../user/entities/user.entity';

@Entity('prestataires')
export abstract class Prestataire {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, { eager: true, onDelete: 'CASCADE' })
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
