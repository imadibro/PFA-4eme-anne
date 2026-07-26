import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ChambreService } from './chambre.service';
import { Chambre } from './entities/chambre.entity';

@Controller('chambres')
export class ChambreController {
  constructor(private readonly chambreService: ChambreService) {}

  @Get()
  findAll(): Promise<Chambre[]> {
    return this.chambreService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Chambre | null> {
    return this.chambreService.findOne(id);
  }

  @Post()
  create(@Body() chambre: Partial<Chambre>): Promise<Chambre> {
    return this.chambreService.create(chambre);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() chambre: Partial<Chambre>,
  ): Promise<Chambre | null> {
    return this.chambreService.update(id, chambre);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.chambreService.remove(id);
  }
}
