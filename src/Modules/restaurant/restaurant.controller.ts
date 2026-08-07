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
import { RestaurantDto } from './dto/restaurant.dto';
import { CreateRestaurantPayload } from './payload/create-restaurant.payload';
import { UpdateRestaurantPayload } from './payload/update-restaurant.payload';
import { RestaurantService } from './restaurant.service';

@Controller('restaurants')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Get()
  @Public()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string
  ): Promise<PaginatedResult<RestaurantDto>> {
    return this.restaurantService.findAll(Number(page), Number(limit), search);
  }

  @Get(':id')
  @Public()
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<RestaurantDto> {
    return this.restaurantService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(UserRole.PRESTATAIRE, UserRole.ADMIN)
  async create(@Body() createRestaurantPayload: CreateRestaurantPayload): Promise<RestaurantDto> {
    return this.restaurantService.create(createRestaurantPayload);
  }

  @Put(':id')
  @UseGuards(PrestataireOwnershipGuard)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRestaurantPayload: UpdateRestaurantPayload
  ): Promise<RestaurantDto> {
    return this.restaurantService.update(id, updateRestaurantPayload);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(PrestataireOwnershipGuard)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.restaurantService.remove(id);
  }
}
