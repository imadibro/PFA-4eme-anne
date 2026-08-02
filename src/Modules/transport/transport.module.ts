import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgenceVoyage } from '../agence-voyage/entities/agence-voyage.entity';
import { Transport } from './entities/transport.entity';
import { TransportController } from './transport.controller';
import { TransportService } from './transport.service';

@Module({
  imports: [TypeOrmModule.forFeature([Transport, AgenceVoyage])],
  controllers: [TransportController],
  providers: [TransportService],
  exports: [TransportService]
})
export class TransportModule {}
