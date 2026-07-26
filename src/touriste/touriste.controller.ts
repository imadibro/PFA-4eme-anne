import { Controller, Get, Post, Body, Delete, Param } from '@nestjs/common';
import { TouristeService } from './touriste.service';
import { Touriste } from './entities/touriste.entity';

@Controller('touristes')
export class TouristeController {
  constructor(private readonly touristeService: TouristeService) {}

  @Get()
  findAll(): Promise<Touriste[]> {
    return this.touristeService.findAll();
  }

  @Post()
  create(@Body() touriste: Partial<Touriste>): Promise<Touriste> {
    return this.touristeService.create(touriste);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.touristeService.remove(id);
  }
}
