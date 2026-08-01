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
import { PackVoyageDto } from './dto/pack-voyage.dto';
import { PackVoyageService } from './pack-voyage.service';
import { CreatePackVoyagePayload } from './payload/create-pack-voyage.payload';
import { UpdatePackVoyagePayload } from './payload/update-pack-voyage.payload';

@Controller('packs-voyage')
export class PackVoyageController {
  constructor(private readonly packVoyageService: PackVoyageService) {}

  @Get()
  async findAll(
    @Query() query: FindAllQuryParams
  ): Promise<{ packs: PackVoyageDto[]; total: number; page: number; totalPages: number }> {
    let { page, limit, search } = query;
    page = page ?? 1;
    limit = limit ?? 10;
    limit = Math.min(limit);
    return this.packVoyageService.findAll(page, limit, search);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<PackVoyageDto> {
    return this.packVoyageService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createPackVoyagePayload: CreatePackVoyagePayload): Promise<PackVoyageDto> {
    return this.packVoyageService.create(createPackVoyagePayload);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePackVoyagePayload: UpdatePackVoyagePayload
  ): Promise<PackVoyageDto> {
    return this.packVoyageService.update(id, updatePackVoyagePayload);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.packVoyageService.remove(id);
  }
}
