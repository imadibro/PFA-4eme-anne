import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Avis } from './entities/avis.entity';

@Injectable()
export class AvisService {
  constructor(
    @InjectRepository(Avis)
    private readonly avisRepository: Repository<Avis>,
  ) {}

  findAll(): Promise<Avis[]> {
    return this.avisRepository.find();
  }

  findOne(id: number): Promise<Avis | null> {
    return this.avisRepository.findOneBy({ id });
  }

  create(avis: Partial<Avis>): Promise<Avis> {
    const newAvis = this.avisRepository.create(avis);
    return this.avisRepository.save(newAvis);
  }

  async remove(id: number): Promise<void> {
    await this.avisRepository.delete(id);
  }
}
