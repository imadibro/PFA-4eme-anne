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
  Query,
  UseGuards
} from '@nestjs/common';
import { PaginatedResult } from 'src/common';
import { CurrentUser, Roles } from 'src/common/decorators';
import { UserRole } from 'src/common/enums';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { OwnershipGuard } from 'src/common/guards/ownership.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { FindAllQuryParams } from 'src/common/payload/findAllQuryParams';
import type { JWTPayloadType } from 'src/common/type/type';
import { ReservationDto } from './dto/reservation.dto';
import { CreateReservationPayload } from './payload/create-reservation.payload';
import { UpdateReservationPayload } from './payload/update-reservation.payload';
import { ReservationService } from './reservation.service';

@Controller('reservations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  async findAll(@Query() query: FindAllQuryParams): Promise<PaginatedResult<ReservationDto>> {
    let { page, limit, search } = query;
    page = page ?? 1;
    limit = limit ?? 10;
    limit = Math.min(limit);
    return this.reservationService.findAll(page, limit, search);
  }

  @Get('me')
  @Roles(UserRole.TOURISTE)
  async getMyReservations(
    @CurrentUser() user: JWTPayloadType,
    @Query() query: FindAllQuryParams
  ): Promise<PaginatedResult<ReservationDto>> {
    let { page, limit } = query;
    page = page ?? 1;
    limit = limit ?? 10;
    return this.reservationService.findByTouristeUserId(user.id, page, limit);
  }

  @Get(':id')
  @UseGuards(OwnershipGuard)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ReservationDto> {
    return this.reservationService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(UserRole.TOURISTE, UserRole.ADMIN)
  async create(@Body() createReservationPayload: CreateReservationPayload): Promise<ReservationDto> {
    return this.reservationService.create(createReservationPayload);
  }

  @Put(':id')
  @UseGuards(OwnershipGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReservationPayload: UpdateReservationPayload
  ): Promise<ReservationDto> {
    return this.reservationService.update(id, updateReservationPayload);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(OwnershipGuard)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.reservationService.remove(id);
  }
}
