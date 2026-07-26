import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { AgenceVoyageService } from './agence-voyage.service';
import { AgenceVoyage } from './entities/agence-voyage.entity';

@Controller('agences-voyage')
export class AgenceVoyageController {
  constructor(private readonly agenceVoyageService: AgenceVoyageService) {}

  @Get()
  findAll(): Promise<AgenceVoyage[]> {
    return this.agenceVoyageService.findAll();
  }

  @Post()
  create(@Body() agenceVoyage: Partial<AgenceVoyage>): Promise<AgenceVoyage> {
    return this.agenceVoyageService.create(agenceVoyage);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.agenceVoyageService.remove(id);
  }
}
