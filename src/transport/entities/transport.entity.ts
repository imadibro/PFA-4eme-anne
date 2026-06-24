import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { AgenceVoyage } from '../../agence-voyage/entities/agence-voyage.entity';
import { TypeTransport } from '../../common/enums';

@Entity()
export class Transport {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: TypeTransport })
  type: TypeTransport;

  @Column()
  capacite: number;

  @Column({ type: 'double precision' })
  prixJr: number;

  @ManyToOne(() => AgenceVoyage)
  agenceVoyage: AgenceVoyage;
}
