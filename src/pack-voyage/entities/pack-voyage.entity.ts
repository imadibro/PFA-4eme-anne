import { Hotel } from 'src/hotel/entities/hotel.entity';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';
import { Transport } from 'src/transport/entities/transport.entity';
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
import { AgenceVoyage } from '../../agence-voyage/entities/agence-voyage.entity';
import { Circuit } from '../../circuit/entities/circuit.entity';
import { TypePack } from '../../common/enums';
import { Guide } from '../../guide/entities/guide.entity';

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
