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
import { HotelDto } from './dto/hotel.dto';
import { HotelService } from './hotel.service';
import { CreateHotelPayload } from './payload/create-hotel.payload';
import { UpdateHotelPayload } from './payload/update-hotel.payload';

@Controller('hotels')
export class HotelController {
  constructor(private readonly hotelService: HotelService) {}

  @Get()
  async findAll(
    @Query() query: FindAllQuryParams
  ): Promise<{ hotels: HotelDto[]; total: number; page: number; totalPages: number }> {
    let { page, limit, search } = query;
    page = page ?? 1;
    limit = limit ?? 10;
    limit = Math.min(limit);
    return this.hotelService.findAll(page, limit, search);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<HotelDto> {
    return this.hotelService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createHotelPayload: CreateHotelPayload): Promise<HotelDto> {
    return this.hotelService.create(createHotelPayload);
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateHotelPayload: UpdateHotelPayload
  ): Promise<HotelDto> {
    return this.hotelService.update(id, updateHotelPayload);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.hotelService.remove(id);
  }
}
