import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Touriste } from './entities/touriste.entity';
import { TouristeService } from './touriste.service';
import { TouristeController } from './touriste.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Touriste])],
  controllers: [TouristeController],
  providers: [TouristeService],
  exports: [TouristeService],
})
export class TouristeModule {}
