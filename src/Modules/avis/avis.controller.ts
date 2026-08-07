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
import { OwnershipGuard } from 'src/common/guards/ownership.guard';
import { Public } from 'src/common/guards/public-route.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { FindAllQuryParams } from 'src/common/payload/findAllQuryParams';
import { AvisService } from './avis.service';
import { AvisDto } from './dto/avis.dto';
import { CreateAvisPayload } from './payload/create-avis.payload';
import { UpdateAvisPayload } from './payload/update-avis.payload';

@Controller('avis')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AvisController {
  constructor(private readonly avisService: AvisService) {}

  @Get()
  @Public()
  async findAll(
    @Query() query: FindAllQuryParams
  ): Promise<{ avis: AvisDto[]; total: number; page: number; totalPages: number }> {
    let { page, limit, search } = query;
    page = page ?? 1;
    limit = limit ?? 10;
    limit = Math.min(limit);
    return this.avisService.findAll(page, limit, search);
  }

  @Get(':id')
  @Public()
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<AvisDto> {
    return this.avisService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(UserRole.TOURISTE, UserRole.ADMIN)
  async create(@Body() createAvisPayload: CreateAvisPayload): Promise<AvisDto> {
    return this.avisService.create(createAvisPayload);
  }

  @Put(':id')
  @UseGuards(OwnershipGuard)
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateAvisPayload: UpdateAvisPayload): Promise<AvisDto> {
    return this.avisService.update(id, updateAvisPayload);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(OwnershipGuard)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.avisService.remove(id);
  }
}
