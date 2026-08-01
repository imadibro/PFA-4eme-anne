import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hotel } from '../hotel/entities/hotel.entity';
import { ChambreController } from './chambre.controller';
import { ChambreService } from './chambre.service';
import { Chambre } from './entities/chambre.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Chambre, Hotel])],
  controllers: [ChambreController],
  providers: [ChambreService],
  exports: [ChambreService]
})
export class ChambreModule {}
