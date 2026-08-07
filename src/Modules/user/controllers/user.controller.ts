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
import { PaginatedResult } from 'src/common';
import { CurrentUser, Roles } from 'src/common/decorators';
import { UserRole } from 'src/common/enums';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { OwnershipGuard } from 'src/common/guards/ownership.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { FindAllQuryParams } from 'src/common/payload/findAllQuryParams';
import type { JWTPayloadType } from 'src/common/type/type';
import { UserDto } from '../dto/userDto';
import { User } from '../entities/user.entity';
import { UserService } from '../services/user.service';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(201)
  @Roles(UserRole.ADMIN)
  create(@Body() user: Partial<User>): Promise<UserDto> {
    return this.userService.create(user);
  }

  @Get()
  @HttpCode(200)
  @Roles(UserRole.ADMIN)
  findAll(@Query() query: FindAllQuryParams): Promise<PaginatedResult<UserDto>> {
    try {
      let { page, limit, search } = query;
      page = page ?? 1;
      limit = limit ?? 10;
      limit = Math.min(limit);

      return this.userService.findAll(page, limit, search);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      const stack = error instanceof Error ? error.stack : undefined;
      this.logger.log(`Failed to find users: ${message}`, stack);
      throw new BadRequestException('Error fetching users. Please try again later.');
    }
  }

  @Get('currentUser')
  @HttpCode(200)
  public getCurrentUser(@CurrentUser() payload: JWTPayloadType): Promise<UserDto> {
    return this.userService.getCurrentUser(payload.id);
  }

  @Get(':id')
  @HttpCode(200)
  @UseGuards(OwnershipGuard)
  findOne(@Param('id') id: string): Promise<UserDto | null> {
    return this.userService.findOne(id);
  }

  @Put(':id')
  @HttpCode(200)
  @UseGuards(OwnershipGuard)
  update(@Param('id') id: string, @Body() user: Partial<User>): Promise<UserDto | null> {
    return this.userService.update(id, user);
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(OwnershipGuard)
  remove(@Param('id') id: string): Promise<void> {
    return this.userService.remove(id);
  }
}
