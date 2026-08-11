import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TypeChambre } from '../../../common/enums';
import { Hotel } from '../../hotel/entities/hotel.entity';

@Entity()
export class Chambre {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  numero: string;

  @Column({ type: 'enum', enum: TypeChambre })
  type: TypeChambre;

  @Column({ type: 'double precision' })
  prixNuit: number;

  @Column({ default: true })
  estDisponible: boolean;

  @ManyToOne(() => Hotel, hotel => hotel.chambres)
  hotel: Hotel;
}
