import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { HotelService } from './hotel.service';
import { Hotel } from './entities/hotel.entity';

@Controller('hotels')
export class HotelController {
  constructor(private readonly hotelService: HotelService) {}

  @Get()
  findAll(): Promise<Hotel[]> {
    return this.hotelService.findAll();
  }

  @Post()
  create(@Body() hotel: Partial<Hotel>): Promise<Hotel> {
    return this.hotelService.create(hotel);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.hotelService.remove(id);
  }
}
