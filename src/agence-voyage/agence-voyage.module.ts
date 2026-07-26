import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgenceVoyage } from './entities/agence-voyage.entity';
import { AgenceVoyageService } from './agence-voyage.service';
import { AgenceVoyageController } from './agence-voyage.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AgenceVoyage])],
  controllers: [AgenceVoyageController],
  providers: [AgenceVoyageService],
  exports: [AgenceVoyageService],
})
export class AgenceVoyageModule {}
