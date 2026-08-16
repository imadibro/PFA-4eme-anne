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

@Entity('touristes')
export class Touriste {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  nationality: string;

  @Column({ name: 'date_naissance', type: 'date' })
  dateNaissance: Date;

  @CreateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => CURRENT_TIMESTAMP,
    onUpdate: CURRENT_TIMESTAMP
  })
  updatedAt: Date;

  @OneToMany(() => Reservation, reservation => reservation.touriste)
  reservations: Reservation[];

  @OneToMany(() => Avis, avis => avis.touriste)
  avis: Avis[];
}
