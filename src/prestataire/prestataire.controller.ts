import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Prestataire } from './entities/prestataire.entity';
import { PrestataireService } from './prestataire.service';

@Controller('prestataires')
export class PrestataireController {
  constructor(private readonly prestataireService: PrestataireService) {}

  @Get()
  findAll(): Promise<Prestataire[]> {
    return this.prestataireService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Prestataire | null> {
    return this.prestataireService.findOne(id);
  }

  @Post()
  create(@Body() prestataire: Partial<Prestataire>): Promise<Prestataire> {
    return this.prestataireService.create(prestataire);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() prestataire: Partial<Prestataire>): Promise<Prestataire | null> {
    return this.prestataireService.update(id, prestataire);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.prestataireService.remove(id);
  }
}
