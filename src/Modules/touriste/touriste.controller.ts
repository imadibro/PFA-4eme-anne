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
import { OwnershipGuard } from 'src/common/guards/ownership.guard';
import { Public } from 'src/common/guards/public-route.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { FindAllQuryParams } from 'src/common/payload/findAllQuryParams';
import { TouristeDto } from './dto/touriste.dto';
import { CreateTouristePayload } from './payload/create-touriste.payload';
import { UpdateTouristePayload } from './payload/update-touriste.payload';
import { TouristeService } from './touriste.service';

@Controller('touristes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TouristeController {
  constructor(private readonly touristeService: TouristeService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  async findAll(@Query() query: FindAllQuryParams): Promise<PaginatedResult<TouristeDto>> {
    let { page, limit, search } = query;
    page = page ?? 1;
    limit = limit ?? 10;
    limit = Math.min(limit);
    return this.touristeService.findAll(page, limit, search);
  }

  @Get(':id')
  @UseGuards(OwnershipGuard)
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<TouristeDto> {
    return this.touristeService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Public()
  async create(@Body() createTouristePayload: CreateTouristePayload): Promise<TouristeDto> {
    return this.touristeService.create(createTouristePayload);
  }

  @Put(':id')
  @UseGuards(OwnershipGuard)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTouristePayload: UpdateTouristePayload
  ): Promise<TouristeDto> {
    return this.touristeService.update(id, updateTouristePayload);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(OwnershipGuard)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.touristeService.remove(id);
  }
}
