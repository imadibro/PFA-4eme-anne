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
import { ChambreService } from './chambre.service';
import { ChambreDto } from './dto/chambre.dto';
import { CreateChambrePayload } from './payload/create-chambre.payload';
import { UpdateChambrePayload } from './payload/update-chambre.payload';

@Controller('chambres')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ChambreController {
  constructor(private readonly chambreService: ChambreService) {}

  @Get()
  @Public()
  async findAll(
    @Query() query: FindAllQuryParams
  ): Promise<{ chambres: ChambreDto[]; total: number; page: number; totalPages: number }> {
    let { page, limit, search } = query;
    page = page ?? 1;
    limit = limit ?? 10;
    limit = Math.min(limit);
    return this.chambreService.findAll(page, limit, search);
  }

  @Get(':id')
  @Public()
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ChambreDto> {
    return this.chambreService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(UserRole.PRESTATAIRE, UserRole.ADMIN)
  async create(@Body() createChambrePayload: CreateChambrePayload): Promise<ChambreDto> {
    return this.chambreService.create(createChambrePayload);
  }

  @Put(':id')
  @UseGuards(PrestataireOwnershipGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateChambrePayload: UpdateChambrePayload
  ): Promise<ChambreDto> {
    return this.chambreService.update(id, updateChambrePayload);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(PrestataireOwnershipGuard)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.chambreService.remove(id);
  }
}
