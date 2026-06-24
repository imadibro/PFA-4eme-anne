import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PackVoyage } from './entities/pack-voyage.entity';

@Injectable()
export class PackVoyageService {
  constructor(
    @InjectRepository(PackVoyage)
    private readonly packVoyageRepository: Repository<PackVoyage>,
  ) {}

  findAll(): Promise<PackVoyage[]> {
    return this.packVoyageRepository.find({ relations: ['guides', 'circuit'] });
  }

  findOne(id: number): Promise<PackVoyage | null> {
    return this.packVoyageRepository.findOneBy({ id });
  }

  create(packVoyage: Partial<PackVoyage>): Promise<PackVoyage> {
    const newPack = this.packVoyageRepository.create(packVoyage);
    return this.packVoyageRepository.save(newPack);
  }

  async remove(id: number): Promise<void> {
    await this.packVoyageRepository.delete(id);
  }
}
