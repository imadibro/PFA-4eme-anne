import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { GuideService } from './guide.service';
import { Guide } from './entities/guide.entity';

@Controller('guides')
export class GuideController {
  constructor(private readonly guideService: GuideService) {}

  @Get()
  findAll(): Promise<Guide[]> {
    return this.guideService.findAll();
  }

  @Post()
  create(@Body() guide: Partial<Guide>): Promise<Guide> {
    return this.guideService.create(guide);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.guideService.remove(id);
  }
}
