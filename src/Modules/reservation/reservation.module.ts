import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PackVoyage } from '../../pack-voyage/entities/pack-voyage.entity';
import { Chambre } from '../chambre/entities/chambre.entity';
import { Prestataire } from '../prestataire/entities/prestataire.entity';
import { Touriste } from '../touriste/entities/touriste.entity';
import { Transport } from '../transport/entities/transport.entity';
import { Reservation } from './entities/reservation.entity';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation, Touriste, Prestataire, Chambre, Transport, PackVoyage])],
  controllers: [ReservationController],
  providers: [ReservationService],
  exports: [ReservationService]
})
export class ReservationModule {}
