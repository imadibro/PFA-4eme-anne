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
import { PrestataireDto } from './dto/prestataire.dto';
import { CreatePrestatairePayload } from './payload/create-prestataire.payload';
import { UpdatePrestatairePayload } from './payload/update-prestataire.payload';
import { PrestataireService } from './prestataire.service';

@Controller('prestataires')
export class PrestataireController {
  constructor(private readonly prestataireService: PrestataireService) {}

  @Get()
  async findAll(
    @Query() query: FindAllQuryParams
  ): Promise<{ prestataires: PrestataireDto[]; total: number; page: number; totalPages: number }> {
    let { page, limit, search } = query;
    page = page ?? 1;
    limit = limit ?? 10;
    limit = Math.min(limit);
    return this.prestataireService.findAll(page, limit, search);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<PrestataireDto> {
    return this.prestataireService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createPrestatairePayload: CreatePrestatairePayload): Promise<PrestataireDto> {
    return this.prestataireService.create(createPrestatairePayload);
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePrestatairePayload: UpdatePrestatairePayload
  ): Promise<PrestataireDto> {
    return this.prestataireService.update(id, updatePrestatairePayload);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.prestataireService.remove(id);
  }
}
