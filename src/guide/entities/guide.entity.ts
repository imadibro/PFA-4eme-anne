import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { Prestataire } from '../../prestataire/entities/prestataire.entity';

@Entity()
export class Guide {
  @OneToOne(() => Prestataire, { eager: true })
  @JoinColumn()
  prestataire: Prestataire;

  @Column('simple-array')
  listLangues: string[];

  @Column({ type: 'double precision' })
  tarifJrs: number;
}
