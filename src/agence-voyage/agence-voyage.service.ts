import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AgenceVoyage } from './entities/agence-voyage.entity';

@Injectable()
export class AgenceVoyageService {
  constructor(
    @InjectRepository(AgenceVoyage)
    private readonly agenceVoyageRepository: Repository<AgenceVoyage>
  ) {}

  findAll(): Promise<AgenceVoyage[]> {
    return this.agenceVoyageRepository.find({ relations: { packs: true } });
  }

  create(agenceVoyage: Partial<AgenceVoyage>): Promise<AgenceVoyage> {
    const newAgence = this.agenceVoyageRepository.create(agenceVoyage);
    return this.agenceVoyageRepository.save(newAgence);
  }

  async remove(id: string): Promise<void> {
    await this.agenceVoyageRepository.delete(id);
  }
}
