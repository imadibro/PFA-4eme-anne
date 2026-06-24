import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transport } from './entities/transport.entity';

@Injectable()
export class TransportService {
  constructor(
    @InjectRepository(Transport)
    private readonly transportRepository: Repository<Transport>,
  ) {}

  findAll(): Promise<Transport[]> {
    return this.transportRepository.find();
  }

  findOne(id: number): Promise<Transport | null> {
    return this.transportRepository.findOneBy({ id });
  }

  create(transport: Partial<Transport>): Promise<Transport> {
    const newTransport = this.transportRepository.create(transport);
    return this.transportRepository.save(newTransport);
  }

  async remove(id: number): Promise<void> {
    await this.transportRepository.delete(id);
  }
}
