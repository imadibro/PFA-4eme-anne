import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Circuit } from './entities/circuit.entity';

@Injectable()
export class CircuitService {
  constructor(
    @InjectRepository(Circuit)
    private readonly circuitRepository: Repository<Circuit>,
  ) {}

  findAll(): Promise<Circuit[]> {
    return this.circuitRepository.find();
  }

  findOne(id: number): Promise<Circuit | null> {
    return this.circuitRepository.findOneBy({ id });
  }

  create(circuit: Partial<Circuit>): Promise<Circuit> {
    const newCircuit = this.circuitRepository.create(circuit);
    return this.circuitRepository.save(newCircuit);
  }

  async remove(id: number): Promise<void> {
    await this.circuitRepository.delete(id);
  }
}
