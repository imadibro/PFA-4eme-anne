import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prestataire } from '../prestataire/entities/prestataire.entity';
import { Guide } from './entities/guide.entity';
import { GuideController } from './guide.controller';
import { GuideService } from './guide.service';

@Module({
  imports: [TypeOrmModule.forFeature([Guide, Prestataire])],
  controllers: [GuideController],
  providers: [GuideService],
  exports: [GuideService]
})
export class GuideModule {}
