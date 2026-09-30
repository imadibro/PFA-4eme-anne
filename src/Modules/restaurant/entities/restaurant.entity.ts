import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Prestataire } from '../../prestataire/entities/prestataire.entity';

@Entity('restaurants')
export class Restaurant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Prestataire, p => p.restaurants, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'prestataire_id' })
  prestataire: Prestataire;

  @Column({ name: 'type_cuisin' })
  typeCuisin: string;

  @Column()
  horaire: string;

  @Column({ default: 50 })
  capaciteCouverts: number;
}
