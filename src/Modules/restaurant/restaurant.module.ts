import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prestataire } from '../prestataire/entities/prestataire.entity';
import { Restaurant } from './entities/restaurant.entity';
import { RestaurantController } from './restaurant.controller';
import { RestaurantService } from './restaurant.service';

@Module({
  imports: [TypeOrmModule.forFeature([Restaurant, Prestataire])],
  controllers: [RestaurantController],
  providers: [RestaurantService],
  exports: [RestaurantService]
})
export class RestaurantModule {}
