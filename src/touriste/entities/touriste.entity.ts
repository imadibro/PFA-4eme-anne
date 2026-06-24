import { Column, Entity, OneToMany } from 'typeorm';
import { Avis } from '../../avis/entities/avis.entity';
import { Reservation } from '../../reservation/entities/reservation.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Touriste extends User {
  @Column()
  nationality: string;

  @Column({ type: 'date' })
  dateNaissance: Date;

  @OneToMany(() => Reservation, (reservation) => reservation.touriste)
  reservations: Reservation[];

  @OneToMany(() => Avis, (avis) => avis.touriste)
  avis: Avis[];
}
