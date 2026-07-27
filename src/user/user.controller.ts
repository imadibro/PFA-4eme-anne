import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string): Promise<User | null> {
    return this.userService.findOne(id);
  }

  @Post()
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  create(@Body() user: Partial<User>): Promise<User> {
    return this.userService.create(user);
  }

  @Put(':id')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() user: Partial<User>): Promise<User | null> {
    return this.userService.update(id, user);
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string): Promise<void> {
    return this.userService.remove(id);
  }
}
