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
import { PaginatedResult } from 'src/common';
import { FindAllQuryParams } from 'src/common/payload/findAllQuryParams';
import { ReservationDto } from './dto/reservation.dto';
import { CreateReservationPayload } from './payload/create-reservation.payload';
import { UpdateReservationPayload } from './payload/update-reservation.payload';
import { ReservationService } from './reservation.service';

@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Get()
  async findAll(@Query() query: FindAllQuryParams): Promise<PaginatedResult<ReservationDto>> {
    let { page, limit, search } = query;
    page = page ?? 1;
    limit = limit ?? 10;
    limit = Math.min(limit);
    return this.reservationService.findAll(page, limit, search);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ReservationDto> {
    return this.reservationService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createReservationPayload: CreateReservationPayload): Promise<ReservationDto> {
    return this.reservationService.create(createReservationPayload);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReservationPayload: UpdateReservationPayload
  ): Promise<ReservationDto> {
    return this.reservationService.update(id, updateReservationPayload);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.reservationService.remove(id);
  }
}
