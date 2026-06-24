import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { Restaurant } from './entities/restaurant.entity';

@Controller('restaurants')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Get()
  findAll(): Promise<Restaurant[]> {
    return this.restaurantService.findAll();
  }

  @Post()
  create(@Body() restaurant: Partial<Restaurant>): Promise<Restaurant> {
    return this.restaurantService.create(restaurant);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.restaurantService.remove(id);
  }
}
