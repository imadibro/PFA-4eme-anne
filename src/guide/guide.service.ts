import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Guide } from './entities/guide.entity';

@Injectable()
export class GuideService {
  constructor(
    @InjectRepository(Guide)
    private readonly guideRepository: Repository<Guide>,
  ) {}

  findAll(): Promise<Guide[]> {
    return this.guideRepository.find();
  }

  create(guide: Partial<Guide>): Promise<Guide> {
    const newGuide = this.guideRepository.create(guide);
    return this.guideRepository.save(newGuide);
  }

  async remove(id: number): Promise<void> {
    await this.guideRepository.delete(id);
  }
}
