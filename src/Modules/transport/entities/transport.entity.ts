import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AgenceVoyage } from '../../agence-voyage/entities/agence-voyage.entity';
import { TypeTransport } from '../../common/enums';

@Entity('transports')
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
