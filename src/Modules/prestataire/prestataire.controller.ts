import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards
} from '@nestjs/common';
import { PaginatedResult } from 'src/common';
import { CurrentUser, Roles } from 'src/common/decorators';
import { UserRole } from 'src/common/enums';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PrestataireOwnershipGuard } from 'src/common/guards/prestataire-ownership.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { FindAllQuryParams } from 'src/common/payload/findAllQuryParams';
import type { JWTPayloadType } from 'src/common/type/type';
import { PrestataireDto } from './dto/prestataire.dto';
import { CreatePrestatairePayload } from './payload/create-prestataire.payload';
import { UpdatePrestatairePayload } from './payload/update-prestataire.payload';
import { PrestataireService } from './prestataire.service';

@Controller('prestataires')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PrestataireController {
  constructor(private readonly prestataireService: PrestataireService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.TOURISTE)
  async findAll(@Query() query: FindAllQuryParams): Promise<PaginatedResult<PrestataireDto>> {
    let { page, limit, search } = query;
    page = page ?? 1;
    limit = limit ?? 10;
    limit = Math.min(limit);
    return this.prestataireService.findAll(page, limit, search);
  }

  @Get('me')
  @Roles(UserRole.PRESTATAIRE)
  async getMyProfile(@CurrentUser() user: JWTPayloadType): Promise<PrestataireDto> {
    const prestataire = await this.prestataireService.findByUserId(user.id);
    if (!prestataire) {
      throw new NotFoundException('Profil prestataire non trouvé pour cet utilisateur');
    }
    return prestataire;
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.TOURISTE)
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<PrestataireDto> {
    return this.prestataireService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(UserRole.PRESTATAIRE, UserRole.ADMIN)
  async create(@Body() createPrestatairePayload: CreatePrestatairePayload): Promise<PrestataireDto> {
    return this.prestataireService.create(createPrestatairePayload);
  }

  @Put(':id')
  @UseGuards(PrestataireOwnershipGuard)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePrestatairePayload: UpdatePrestatairePayload,
    @CurrentUser() user: JWTPayloadType
  ): Promise<PrestataireDto> {
    if (user.userRole !== UserRole.ADMIN) {
      const isOwner = await this.prestataireService.verifyOwnership(id, user.id);
      if (!isOwner) {
        throw new ForbiddenException('Vous ne pouvez modifier que votre propre profil prestataire');
      }
    }
    return this.prestataireService.update(id, updatePrestatairePayload);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(PrestataireOwnershipGuard)
  async remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: JWTPayloadType): Promise<void> {
    if (user.userRole !== UserRole.ADMIN) {
      const isOwner = await this.prestataireService.verifyOwnership(id, user.id);
      if (!isOwner) {
        throw new ForbiddenException('Vous ne pouvez supprimer que votre propre profil prestataire');
      }
    }
    return this.prestataireService.remove(id);
  }
}
