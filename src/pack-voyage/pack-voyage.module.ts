import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PackVoyage } from './entities/pack-voyage.entity';
import { PackVoyageService } from './pack-voyage.service';
import { PackVoyageController } from './pack-voyage.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PackVoyage])],
  controllers: [PackVoyageController],
  providers: [PackVoyageService],
  exports: [PackVoyageService],
})
export class PackVoyageModule {}
