import { Prestataire } from 'src/prestataire/entities/prestataire.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToOne } from 'typeorm';
import { AgenceVoyage } from '../../agence-voyage/entities/agence-voyage.entity';
import { Circuit } from '../../circuit/entities/circuit.entity';
import { TypePack } from '../../common/enums';
import { Guide } from '../../guide/entities/guide.entity';

@Entity()
export class PackVoyage extends Prestataire {
  @Column()
  nom: string;

  @Column()
  description: string;

  @Column({ type: 'double precision' })
  prix: number;

  @Column({ type: 'enum', enum: TypePack })
  typePack: TypePack;

  @ManyToOne(() => AgenceVoyage, (agence) => agence.packs)
  agenceVoyage: AgenceVoyage;

  @ManyToMany(() => Guide)
  @JoinTable()
  guides: Guide[];

  @OneToOne(() => Circuit)
  circuit: Circuit;
}
