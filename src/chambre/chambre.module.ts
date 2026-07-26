import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chambre } from './entities/chambre.entity';
import { ChambreService } from './chambre.service';
import { ChambreController } from './chambre.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Chambre])],
  controllers: [ChambreController],
  providers: [ChambreService],
  exports: [ChambreService],
})
export class ChambreModule {}
