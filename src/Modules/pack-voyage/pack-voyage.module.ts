import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgenceVoyage } from '../agence-voyage/entities/agence-voyage.entity';
import { Circuit } from '../circuit/entities/circuit.entity';
import { Guide } from '../guide/entities/guide.entity';
import { Hotel } from '../hotel/entities/hotel.entity';
import { Restaurant } from '../restaurant/entities/restaurant.entity';
import { Transport } from '../transport/entities/transport.entity';
import { PackVoyage } from './entities/pack-voyage.entity';

import { PackVoyageService } from './pack-voyage.service';

@Module({
  imports: [TypeOrmModule.forFeature([PackVoyage, AgenceVoyage, Guide, Hotel, Restaurant, Transport, Circuit])],
  controllers: [],
  providers: [PackVoyageService],
  exports: [PackVoyageService]
})
export class PackVoyageModule {}
