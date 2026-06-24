import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Touriste } from './entities/touriste.entity';

@Injectable()
export class TouristeService {
  constructor(
    @InjectRepository(Touriste)
    private readonly touristeRepository: Repository<Touriste>,
  ) {}

  findAll(): Promise<Touriste[]> {
    return this.touristeRepository.find();
  }

  create(touriste: Partial<Touriste>): Promise<Touriste> {
    const newTouriste = this.touristeRepository.create(touriste);
    return this.touristeRepository.save(newTouriste);
  }

  async remove(id: number): Promise<void> {
    await this.touristeRepository.delete(id);
  }
}
