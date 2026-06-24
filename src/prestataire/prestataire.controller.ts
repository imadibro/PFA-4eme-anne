import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { PrestataireService } from './prestataire.service';
import { Prestataire } from './entities/prestataire.entity';

@Controller('prestataires')
export class PrestataireController {
  constructor(private readonly prestataireService: PrestataireService) {}

  @Get()
  findAll(): Promise<Prestataire[]> {
    return this.prestataireService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Prestataire | null> {
    return this.prestataireService.findOne(id);
  }

  @Post()
  create(@Body() prestataire: Partial<Prestataire>): Promise<Prestataire> {
    return this.prestataireService.create(prestataire);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() prestataire: Partial<Prestataire>): Promise<Prestataire | null> {
    return this.prestataireService.update(id, prestataire);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.prestataireService.remove(id);
  }
}
