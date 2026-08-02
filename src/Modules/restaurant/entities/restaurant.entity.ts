import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Prestataire } from '../../prestataire/entities/prestataire.entity';

@Entity('restaurants')
export class Restaurant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Prestataire, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'prestataire_id' })
  prestataire: Prestataire;

  @Column({ name: 'type_cuisin' })
  typeCuisin: string;

  @Column()
  horaire: string;
}
