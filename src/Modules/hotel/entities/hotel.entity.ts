import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Chambre } from '../../chambre/entities/chambre.entity';
import { Prestataire } from '../../prestataire/entities/prestataire.entity';

@Entity('hotels')
export class Hotel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Prestataire, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'prestataire_id' })
  prestataire: Prestataire;

  @Column({ name: 'nbr_etoiles', default: 3 })
  nbrEtoiles: number;

  @Column('simple-array', { nullable: true })
  equipements: string[];

  @OneToMany(() => Chambre, c => c.hotel, { cascade: true })
  chambres: Chambre[];
}
