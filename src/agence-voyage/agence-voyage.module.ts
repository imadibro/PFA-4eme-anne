import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prestataire } from '../prestataire/entities/prestataire.entity';
import { AgenceVoyageController } from './agence-voyage.controller';
import { AgenceVoyageService } from './agence-voyage.service';
import { AgenceVoyage } from './entities/agence-voyage.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AgenceVoyage, Prestataire])],
  controllers: [AgenceVoyageController],
  providers: [AgenceVoyageService],
  exports: [AgenceVoyageService]
})
export class AgenceVoyageModule {}
