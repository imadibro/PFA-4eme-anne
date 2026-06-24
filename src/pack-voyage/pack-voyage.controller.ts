import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { PackVoyageService } from './pack-voyage.service';
import { PackVoyage } from './entities/pack-voyage.entity';

@Controller('packs-voyage')
export class PackVoyageController {
  constructor(private readonly packVoyageService: PackVoyageService) {}

  @Get()
  findAll(): Promise<PackVoyage[]> {
    return this.packVoyageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<PackVoyage | null> {
    return this.packVoyageService.findOne(id);
  }

  @Post()
  create(@Body() packVoyage: Partial<PackVoyage>): Promise<PackVoyage> {
    return this.packVoyageService.create(packVoyage);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.packVoyageService.remove(id);
  }
}
