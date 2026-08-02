import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgenceVoyage } from '../agence-voyage/entities/agence-voyage.entity';
import { Circuit } from '../circuit/entities/circuit.entity';
import { Guide } from '../Modules/guide/entities/guide.entity';
import { Hotel } from '../Modules/hotel/entities/hotel.entity';
import { Restaurant } from '../Modules/restaurant/entities/restaurant.entity';
import { Transport } from '../transport/entities/transport.entity';
import { PackVoyage } from './entities/pack-voyage.entity';
import { PackVoyageController } from './pack-voyage.controller';
import { PackVoyageService } from './pack-voyage.service';

@Module({
  imports: [TypeOrmModule.forFeature([PackVoyage, AgenceVoyage, Guide, Hotel, Restaurant, Transport, Circuit])],
  controllers: [PackVoyageController],
  providers: [PackVoyageService],
  exports: [PackVoyageService]
})
export class PackVoyageModule {}
