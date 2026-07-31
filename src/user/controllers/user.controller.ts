import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UseGuards
} from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { FindAllQuryParams } from 'src/common/payload/findAllQuryParams';
import type { JWTPayloadType } from 'src/common/type/type';
import { UserDto } from '../dto/userDto';
import { User } from '../entities/user.entity';
import { UserService } from '../services/user.service';

@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private readonly userService: UserService) {}

  @Get()
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  findAll(
    @Query() query: FindAllQuryParams
  ): Promise<{ users: UserDto[]; total: number; page: number; totalPages: number }> {
    try {
      let { page, limit, search } = query;
      page = page ?? 1;
      limit = limit ?? 10;
      limit = Math.min(limit);

      return this.userService.findAll(page, limit, search);
    } catch (error) {
      this.logger.log(`Failed to find users: ${error.message}`, error.stack);
      throw new BadRequestException('Error fetching users. Please try again later.');
    }
  }

  @Get('currentUser')
  public getCurrentUser(@CurrentUser() payload: JWTPayloadType): Promise<UserDto> {
    return this.userService.getCurrentUser(payload.id);
  }

  @Get(':id')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string): Promise<UserDto | null> {
    return this.userService.findOne(id);
  }

  @Post()
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  create(@Body() user: Partial<User>): Promise<UserDto> {
    return this.userService.create(user);
  }

  @Put(':id')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() user: Partial<User>): Promise<UserDto | null> {
    return this.userService.update(id, user);
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string): Promise<void> {
    return this.userService.remove(id);
  }
}
