import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { TypePack } from '../../../common/enums/index';
import { AgenceVoyage } from '../../agence-voyage/entities/agence-voyage.entity';
import { Circuit } from '../../circuit/entities/circuit.entity';
import { Guide } from '../../guide/entities/guide.entity';
import { Hotel } from '../../hotel/entities/hotel.entity';
import { Restaurant } from '../../restaurant/entities/restaurant.entity';
import { Transport } from '../../transport/entities/transport.entity';

@Entity()
export class PackVoyage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nom: string;

  @Column()
  description: string;

  @Column({ type: 'double precision' })
  prix: number;

  @Column({ type: 'enum', enum: TypePack })
  typePack: TypePack;

  @ManyToOne(() => AgenceVoyage, agence => agence.packs)
  agenceVoyage: AgenceVoyage;

  @ManyToMany(() => Guide)
  @JoinTable()
  guides: Guide[];

  @ManyToMany(() => Hotel)
  @JoinTable()
  hotels: Hotel[];

  @ManyToMany(() => Restaurant)
  @JoinTable()
  restaurants: Restaurant[];

  @ManyToMany(() => Transport)
  @JoinTable()
  transports: Transport[];

  @OneToOne(() => Circuit)
  @JoinColumn()
  circuit: Circuit;
}
