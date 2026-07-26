import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { TransportService } from './transport.service';
import { Transport } from './entities/transport.entity';

@Controller('transports')
export class TransportController {
  constructor(private readonly transportService: TransportService) {}

  @Get()
  findAll(): Promise<Transport[]> {
    return this.transportService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Transport | null> {
    return this.transportService.findOne(id);
  }

  @Post()
  create(@Body() transport: Partial<Transport>): Promise<Transport> {
    return this.transportService.create(transport);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.transportService.remove(id);
  }
}
