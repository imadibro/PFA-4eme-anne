import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
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

  @OneToMany(() => Reservation, reservation => reservation.touriste)
  reservations: Reservation[];

  @OneToMany(() => Avis, avis => avis.touriste)
  avis: Avis[];
}
