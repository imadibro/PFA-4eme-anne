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
import { FindAllQuryParams } from 'src/common/payload/findAllQuryParams';
import { GuideDto } from './dto/guide.dto';
import { GuideService } from './guide.service';
import { CreateGuidePayload } from './payload/create-guide.payload';
import { UpdateGuidePayload } from './payload/update-guide.payload';

@Controller('guides')
export class GuideController {
  constructor(private readonly guideService: GuideService) {}

  @Get()
  async findAll(@Query() query: FindAllQuryParams): Promise<PaginatedResult<GuideDto>> {
    let { page, limit, search } = query;
    page = page ?? 1;
    limit = limit ?? 10;
    limit = Math.min(limit);
    return this.guideService.findAll(page, limit, search);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<GuideDto> {
    return this.guideService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createGuidePayload: CreateGuidePayload): Promise<GuideDto> {
    return this.guideService.create(createGuidePayload);
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateGuidePayload: UpdateGuidePayload
  ): Promise<GuideDto> {
    return this.guideService.update(id, updateGuidePayload);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.guideService.remove(id);
  }
}
