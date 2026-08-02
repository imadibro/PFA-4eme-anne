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
import { PaginatedResult } from 'src/common';
import { FindAllQuryParams } from 'src/common/payload/findAllQuryParams';
import { TouristeDto } from './dto/touriste.dto';
import { CreateTouristePayload } from './payload/create-touriste.payload';
import { UpdateTouristePayload } from './payload/update-touriste.payload';
import { TouristeService } from './touriste.service';

@Controller('touristes')
export class TouristeController {
  constructor(private readonly touristeService: TouristeService) {}

  @Get()
  async findAll(@Query() query: FindAllQuryParams): Promise<PaginatedResult<TouristeDto>> {
    let { page, limit, search } = query;
    page = page ?? 1;
    limit = limit ?? 10;
    limit = Math.min(limit);
    return this.touristeService.findAll(page, limit, search);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<TouristeDto> {
    return this.touristeService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createTouristePayload: CreateTouristePayload): Promise<TouristeDto> {
    return this.touristeService.create(createTouristePayload);
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTouristePayload: UpdateTouristePayload
  ): Promise<TouristeDto> {
    return this.touristeService.update(id, updateTouristePayload);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.touristeService.remove(id);
  }
}
