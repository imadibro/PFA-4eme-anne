import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemsPerPage, PaginatedResult } from 'src/common';
import { Repository } from 'typeorm';
import { Prestataire } from '../prestataire/entities/prestataire.entity';
import { GuideDto } from './dto/guide.dto';
import { Guide } from './entities/guide.entity';
import { CreateGuidePayload } from './payload/create-guide.payload';
import { UpdateGuidePayload } from './payload/update-guide.payload';

@Injectable()
export class GuideService {
  private readonly logger = new Logger(GuideService.name);

  constructor(
    @InjectRepository(Guide)
    private readonly guideRepository: Repository<Guide>,
    @InjectRepository(Prestataire)
    private readonly prestataireRepository: Repository<Prestataire>
  ) {}

  async findAll(page: number, limit: number, search?: string): Promise<PaginatedResult<GuideDto>> {
    try {
      const validLimit = Object.values(ItemsPerPage).includes(limit) ? limit : ItemsPerPage.Ten;

      const queryBuilder = this.guideRepository
        .createQueryBuilder('guide')
        .leftJoinAndSelect('guide.prestataire', 'prestataire')
        .leftJoinAndSelect('prestataire.user', 'user');

      if (search) {
        queryBuilder.where('prestataire.nomEntreprise ILIKE :search OR prestataire.ville ILIKE :search', {
          search: `%${search}%`
        });
      }

      const [guides, total] = await queryBuilder
        .skip((page - 1) * validLimit)
        .take(validLimit)
        .orderBy('guide.id', 'DESC')
        .getManyAndCount();

      const guideResponse = guides.map(guide => new GuideDto(guide));
      const totalPages = Math.ceil(total / validLimit);

      return { data: guideResponse, total, page, totalPages, limit: validLimit };
    } catch (error) {
      this.logger.error('Erreur lors de la récupération des guides', error);
      throw new InternalServerErrorException('Échec de la récupération des guides');
    }
  }

  async findOne(id: string): Promise<GuideDto> {
    const guide = await this.guideRepository.findOne({
      where: { id },
      relations: { prestataire: { user: true } }
    });

    if (!guide) {
      throw new NotFoundException(`Guide avec l'ID ${id} non trouvé`);
    }

    return new GuideDto(guide);
  }

  async create(createGuidePayload: CreateGuidePayload): Promise<GuideDto> {
    try {
      const prestataire = await this.prestataireRepository.findOne({
        where: { id: createGuidePayload.prestataireId },
        relations: { user: true }
      });

      if (!prestataire) {
        throw new NotFoundException(`Prestataire avec l'ID ${createGuidePayload.prestataireId} non trouvé`);
      }

      const existingGuide = await this.guideRepository.findOne({
        where: { prestataire: { id: createGuidePayload.prestataireId } }
      });

      if (existingGuide) {
        throw new BadRequestException('Un guide existe déjà pour ce prestataire');
      }

      const newGuide = this.guideRepository.create({
        prestataire,
        listLangues: createGuidePayload.listLangues,
        tarifJrs: createGuidePayload.tarifJrs
      });

      const savedGuide = await this.guideRepository.save(newGuide);
      this.logger.log(`Nouveau guide créé avec succès: ${savedGuide.id}`);

      return new GuideDto(savedGuide);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error('Erreur lors de la création du guide', error);
      throw new InternalServerErrorException('Échec de la création du guide');
    }
  }

  async update(id: string, updateGuidePayload: UpdateGuidePayload): Promise<GuideDto> {
    try {
      const guide = await this.guideRepository.findOne({
        where: { id },
        relations: { prestataire: { user: true } }
      });

      if (!guide) {
        throw new NotFoundException(`Guide avec l'ID ${id} non trouvé`);
      }

      if (updateGuidePayload.listLangues !== undefined) {
        guide.listLangues = updateGuidePayload.listLangues;
      }

      if (updateGuidePayload.tarifJrs !== undefined) {
        guide.tarifJrs = updateGuidePayload.tarifJrs;
      }

      const updatedGuide = await this.guideRepository.save(guide);
      this.logger.log(`Guide mis à jour avec succès: ${updatedGuide.id}`);

      return new GuideDto(updatedGuide);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error('Erreur lors de la mise à jour du guide', error);
      throw new InternalServerErrorException('Échec de la mise à jour du guide');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const guide = await this.guideRepository.findOne({ where: { id } });

      if (!guide) {
        throw new NotFoundException(`Guide avec l'ID ${id} non trouvé`);
      }

      await this.guideRepository.remove(guide);
      this.logger.log(`Guide supprimé avec succès: ${id}`);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error('Erreur lors de la suppression du guide', error);
      throw new InternalServerErrorException('Échec de la suppression du guide');
    }
  }
}
