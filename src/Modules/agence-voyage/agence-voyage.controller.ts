import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query
} from '@nestjs/common';
import { FindAllQuryParams } from 'src/common/payload/findAllQuryParams';
import { AgenceVoyageService } from './agence-voyage.service';
import { AgenceVoyageDto } from './dto/agence-voyage.dto';
import { CreateAgenceVoyagePayload } from './payload/create-agence-voyage.payload';
import { UpdateAgenceVoyagePayload } from './payload/update-agence-voyage.payload';

@Controller('agences-voyage')
export class AgenceVoyageController {
  constructor(private readonly agenceVoyageService: AgenceVoyageService) {}

  @Get()
  async findAll(
    @Query() query: FindAllQuryParams
  ): Promise<{ agences: AgenceVoyageDto[]; total: number; page: number; totalPages: number }> {
    let { page, limit, search } = query;
    page = page ?? 1;
    limit = limit ?? 10;
    limit = Math.min(limit);
    return this.agenceVoyageService.findAll(page, limit, search);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<AgenceVoyageDto> {
    return this.agenceVoyageService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createAgenceVoyagePayload: CreateAgenceVoyagePayload): Promise<AgenceVoyageDto> {
    return this.agenceVoyageService.create(createAgenceVoyagePayload);
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAgenceVoyagePayload: UpdateAgenceVoyagePayload
  ): Promise<AgenceVoyageDto> {
    return this.agenceVoyageService.update(id, updateAgenceVoyagePayload);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.agenceVoyageService.remove(id);
  }
}
