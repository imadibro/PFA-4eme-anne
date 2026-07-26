import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prestataire } from './entities/prestataire.entity';

@Injectable()
export class PrestataireService {
  constructor(
    @InjectRepository(Prestataire)
    private readonly prestataireRepository: Repository<Prestataire>,
  ) {}

  findAll(): Promise<Prestataire[]> {
    return this.prestataireRepository.find();
  }

  findOne(id: number): Promise<Prestataire | null> {
    return this.prestataireRepository.findOneBy({ id });
  }

  create(prestataire: Partial<Prestataire>): Promise<Prestataire> {
    const newPrestataire = this.prestataireRepository.create(prestataire);
    return this.prestataireRepository.save(newPrestataire);
  }

  async update(id: number, prestataire: Partial<Prestataire>): Promise<Prestataire | null> {
    await this.prestataireRepository.update(id, prestataire);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.prestataireRepository.delete(id);
  }
}
