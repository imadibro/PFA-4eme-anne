import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prestataire } from '../prestataire/entities/prestataire.entity';
import { Touriste } from '../touriste/entities/touriste.entity';
import { AvisController } from './avis.controller';
import { AvisService } from './avis.service';
import { Avis } from './entities/avis.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Avis, Touriste, Prestataire])],
  controllers: [AvisController],
  providers: [AvisService],
  exports: [AvisService]
})
export class AvisModule {}
