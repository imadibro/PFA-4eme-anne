import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Hotel } from '../../hotel/entities/hotel.entity';
import { TypeChambre } from '../../common/enums';

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

  @ManyToOne(() => Hotel, (hotel) => hotel.chambres)
  hotel: Hotel;
}
