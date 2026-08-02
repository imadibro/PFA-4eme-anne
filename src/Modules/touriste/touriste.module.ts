import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Touriste } from './entities/touriste.entity';
import { TouristeController } from './touriste.controller';
import { TouristeService } from './touriste.service';

@Module({
  imports: [TypeOrmModule.forFeature([Touriste, User])],
  controllers: [TouristeController],
  providers: [TouristeService],
  exports: [TouristeService]
})
export class TouristeModule {}
