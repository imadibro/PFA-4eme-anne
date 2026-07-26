import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant } from './entities/restaurant.entity';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
  ) {}

  findAll(): Promise<Restaurant[]> {
    return this.restaurantRepository.find();
  }

  create(restaurant: Partial<Restaurant>): Promise<Restaurant> {
    const newRestaurant = this.restaurantRepository.create(restaurant);
    return this.restaurantRepository.save(newRestaurant);
  }

  async remove(id: number): Promise<void> {
    await this.restaurantRepository.delete(id);
  }
}
