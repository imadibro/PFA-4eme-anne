import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chambre } from './entities/chambre.entity';

@Injectable()
export class ChambreService {
  constructor(
    @InjectRepository(Chambre)
    private readonly chambreRepository: Repository<Chambre>,
  ) {}

  findAll(): Promise<Chambre[]> {
    return this.chambreRepository.find();
  }

  findOne(id: number): Promise<Chambre | null> {
    return this.chambreRepository.findOneBy({ id });
  }

  create(chambre: Partial<Chambre>): Promise<Chambre> {
    const newChambre = this.chambreRepository.create(chambre);
    return this.chambreRepository.save(newChambre);
  }

  async update(id: number, chambre: Partial<Chambre>): Promise<Chambre | null> {
    await this.chambreRepository.update(id, chambre);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.chambreRepository.delete(id);
  }
}
