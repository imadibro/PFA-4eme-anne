import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from './entities/reservation.entity';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
  ) {}

  findAll(): Promise<Reservation[]> {
    return this.reservationRepository.find();
  }

  findOne(id: number): Promise<Reservation | null> {
    return this.reservationRepository.findOneBy({ id });
  }

  create(reservation: Partial<Reservation>): Promise<Reservation> {
    const newReservation = this.reservationRepository.create(reservation);
    return this.reservationRepository.save(newReservation);
  }

  async update(id: number, reservation: Partial<Reservation>): Promise<Reservation | null> {
    await this.reservationRepository.update(id, reservation);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.reservationRepository.delete(id);
  }
}
