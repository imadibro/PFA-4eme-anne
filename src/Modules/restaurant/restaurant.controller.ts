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
import { PaginatedResult } from 'src/common';
import { RestaurantDto } from './dto/restaurant.dto';
import { CreateRestaurantPayload } from './payload/create-restaurant.payload';
import { UpdateRestaurantPayload } from './payload/update-restaurant.payload';
import { RestaurantService } from './restaurant.service';

@Controller('restaurants')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string
  ): Promise<PaginatedResult<RestaurantDto>> {
    return this.restaurantService.findAll(Number(page), Number(limit), search);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<RestaurantDto> {
    return this.restaurantService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createRestaurantPayload: CreateRestaurantPayload): Promise<RestaurantDto> {
    return this.restaurantService.create(createRestaurantPayload);
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRestaurantPayload: UpdateRestaurantPayload
  ): Promise<RestaurantDto> {
    return this.restaurantService.update(id, updateRestaurantPayload);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.restaurantService.remove(id);
  }
}
