import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AgenceVoyage } from './entities/agence-voyage.entity';

@Injectable()
export class AgenceVoyageService {
  constructor(
    @InjectRepository(AgenceVoyage)
    private readonly agenceVoyageRepository: Repository<AgenceVoyage>,
  ) {}

  findAll(): Promise<AgenceVoyage[]> {
    return this.agenceVoyageRepository.find({ relations: ['packs'] });
  }

  create(agenceVoyage: Partial<AgenceVoyage>): Promise<AgenceVoyage> {
    const newAgence = this.agenceVoyageRepository.create(agenceVoyage);
    return this.agenceVoyageRepository.save(newAgence);
  }

  async remove(id: number): Promise<void> {
    await this.agenceVoyageRepository.delete(id);
  }
}
