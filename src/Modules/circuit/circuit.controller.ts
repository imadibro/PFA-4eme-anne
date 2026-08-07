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
import { Roles } from 'src/common/decorators';
import { UserRole } from 'src/common/enums';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PrestataireOwnershipGuard } from 'src/common/guards/prestataire-ownership.guard';
import { Public } from 'src/common/guards/public-route.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { FindAllQuryParams } from 'src/common/payload/findAllQuryParams';
import { CircuitService } from './circuit.service';
import { CircuitDto } from './dto/circuit.dto';
import { CreateCircuitPayload } from './payload/create-circuit.payload';
import { UpdateCircuitPayload } from './payload/update-circuit.payload';

@Controller('circuits')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CircuitController {
  constructor(private readonly circuitService: CircuitService) {}

  @Get()
  @Public()
  async findAll(
    @Query() query: FindAllQuryParams
  ): Promise<{ circuits: CircuitDto[]; total: number; page: number; totalPages: number }> {
    let { page, limit, search } = query;
    page = page ?? 1;
    limit = limit ?? 10;
    limit = Math.min(limit);
    return this.circuitService.findAll(page, limit, search);
  }

  @Get(':id')
  @Public()
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<CircuitDto> {
    return this.circuitService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(UserRole.PRESTATAIRE, UserRole.ADMIN)
  async create(@Body() createCircuitPayload: CreateCircuitPayload): Promise<CircuitDto> {
    return this.circuitService.create(createCircuitPayload);
  }

  @Put(':id')
  @UseGuards(PrestataireOwnershipGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCircuitPayload: UpdateCircuitPayload
  ): Promise<CircuitDto> {
    return this.circuitService.update(id, updateCircuitPayload);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(PrestataireOwnershipGuard)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.circuitService.remove(id);
  }
}
