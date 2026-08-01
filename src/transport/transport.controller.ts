import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query
} from '@nestjs/common';
import { FindAllQuryParams } from 'src/common/payload/findAllQuryParams';
import { TransportDto } from './dto/transport.dto';
import { CreateTransportPayload } from './payload/create-transport.payload';
import { UpdateTransportPayload } from './payload/update-transport.payload';
import { TransportService } from './transport.service';

@Controller('transports')
export class TransportController {
  constructor(private readonly transportService: TransportService) {}

  @Get()
  async findAll(
    @Query() query: FindAllQuryParams,
    @Query('agenceVoyageId') agenceVoyageId?: string
  ): Promise<{ transports: TransportDto[]; total: number; page: number; totalPages: number }> {
    let { page, limit, search } = query;
    page = page ?? 1;
    limit = limit ?? 10;
    limit = Math.min(limit);
    return this.transportService.findAll(Number(page), Number(limit), search, agenceVoyageId);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<TransportDto> {
    return this.transportService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createTransportPayload: CreateTransportPayload): Promise<TransportDto> {
    return this.transportService.create(createTransportPayload);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTransportPayload: UpdateTransportPayload
  ): Promise<TransportDto> {
    return this.transportService.update(id, updateTransportPayload);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.transportService.remove(id);
  }
}
