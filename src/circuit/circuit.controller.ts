import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { CircuitService } from './circuit.service';
import { Circuit } from './entities/circuit.entity';

@Controller('circuits')
export class CircuitController {
  constructor(private readonly circuitService: CircuitService) {}

  @Get()
  findAll(): Promise<Circuit[]> {
    return this.circuitService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Circuit | null> {
    return this.circuitService.findOne(id);
  }

  @Post()
  create(@Body() circuit: Partial<Circuit>): Promise<Circuit> {
    return this.circuitService.create(circuit);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.circuitService.remove(id);
  }
}
