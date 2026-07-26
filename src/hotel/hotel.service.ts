import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hotel } from './entities/hotel.entity';

@Injectable()
export class HotelService {
  constructor(
    @InjectRepository(Hotel)
    private readonly hotelRepository: Repository<Hotel>,
  ) {}

  findAll(): Promise<Hotel[]> {
    return this.hotelRepository.find({ relations: ['chambres'] });
  }

  create(hotel: Partial<Hotel>): Promise<Hotel> {
    const newHotel = this.hotelRepository.create(hotel);
    return this.hotelRepository.save(newHotel);
  }

  async remove(id: number): Promise<void> {
    await this.hotelRepository.delete(id);
  }
}
