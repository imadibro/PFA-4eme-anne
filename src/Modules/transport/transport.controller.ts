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
import { Roles } from 'src/common/decorators';
import { UserRole } from 'src/common/enums';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PrestataireOwnershipGuard } from 'src/common/guards/prestataire-ownership.guard';
import { Public } from 'src/common/guards/public-route.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { FindAllQuryParams } from 'src/common/payload/findAllQuryParams';
import { TransportDto } from './dto/transport.dto';
import { CreateTransportPayload } from './payload/create-transport.payload';
import { UpdateTransportPayload } from './payload/update-transport.payload';
import { TransportService } from './transport.service';

@Controller('transports')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TransportController {
  constructor(private readonly transportService: TransportService) {}

  @Get()
  @Public()
  async findAll(
    @Query() query: FindAllQuryParams,
    @Query('agenceVoyageId') agenceVoyageId?: string
  ): Promise<PaginatedResult<TransportDto>> {
    let { page, limit, search } = query;
    page = page ?? 1;
    limit = limit ?? 10;
    limit = Math.min(limit);
    return this.transportService.findAll(Number(page), Number(limit), search, agenceVoyageId);
  }

  @Get(':id')
  @Public()
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<TransportDto> {
    return this.transportService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(UserRole.PRESTATAIRE, UserRole.ADMIN)
  async create(@Body() createTransportPayload: CreateTransportPayload): Promise<TransportDto> {
    return this.transportService.create(createTransportPayload);
  }

  @Put(':id')
  @UseGuards(PrestataireOwnershipGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTransportPayload: UpdateTransportPayload
  ): Promise<TransportDto> {
    return this.transportService.update(id, updateTransportPayload);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(PrestataireOwnershipGuard)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.transportService.remove(id);
  }
}
