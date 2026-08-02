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

  @Column({ name: 'nbr_chambre' })
  nbrChambre: number;

  @Column({ name: 'nbr_etoiles' })
  nbrEtoiles: number;

  @OneToMany(() => Chambre, c => c.hotel)
  chambres: Chambre[];
}
