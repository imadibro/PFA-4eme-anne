import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Circuit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'double precision' })
  prix: number;

  @Column()
  dureeJours: number;
}
