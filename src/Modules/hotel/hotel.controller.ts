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
  Query,
  UseGuards
} from '@nestjs/common';
import { PaginatedResult } from 'src/common';
import { Roles } from 'src/common/decorators';
import { UserRole } from 'src/common/enums';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PrestataireOwnershipGuard } from 'src/common/guards/prestataire-ownership.guard';
import { Public } from 'src/common/guards/public-route.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { FindAllQuryParams } from 'src/common/payload/findAllQuryParams';
import { HotelDto } from './dto/hotel.dto';
import { HotelService } from './hotel.service';
import { CreateHotelPayload } from './payload/create-hotel.payload';
import { UpdateHotelPayload } from './payload/update-hotel.payload';

@Controller('hotels')
@UseGuards(JwtAuthGuard, RolesGuard)
export class HotelController {
  constructor(private readonly hotelService: HotelService) {}

  @Get()
  @Public()
  async findAll(@Query() query: FindAllQuryParams): Promise<PaginatedResult<HotelDto>> {
    let { page, limit, search } = query;
    page = page ?? 1;
    limit = limit ?? 10;
    limit = Math.min(limit);
    return this.hotelService.findAll(page, limit, search);
  }

  @Get(':id')
  @Public()
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<HotelDto> {
    return this.hotelService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(UserRole.PRESTATAIRE, UserRole.ADMIN)
  async create(@Body() createHotelPayload: CreateHotelPayload): Promise<HotelDto> {
    return this.hotelService.create(createHotelPayload);
  }

  @Put(':id')
  @UseGuards(PrestataireOwnershipGuard)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateHotelPayload: UpdateHotelPayload
  ): Promise<HotelDto> {
    return this.hotelService.update(id, updateHotelPayload);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(PrestataireOwnershipGuard)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.hotelService.remove(id);
  }
}
