import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { AvisService } from './avis.service';
import { Avis } from './entities/avis.entity';

@Controller('avis')
export class AvisController {
  constructor(private readonly avisService: AvisService) {}

  @Get()
  findAll(): Promise<Avis[]> {
    return this.avisService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Avis | null> {
    return this.avisService.findOne(id);
  }

  @Post()
  create(@Body() avis: Partial<Avis>): Promise<Avis> {
    return this.avisService.create(avis);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.avisService.remove(id);
  }
}
