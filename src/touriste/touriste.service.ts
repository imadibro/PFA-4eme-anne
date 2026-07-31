import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemsPerPage } from 'src/common';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { TouristeDto } from './dto/touriste.dto';
import { Touriste } from './entities/touriste.entity';
import { CreateTouristePayload } from './payload/create-touriste.payload';
import { UpdateTouristePayload } from './payload/update-touriste.payload';

@Injectable()
export class TouristeService {
  private readonly logger = new Logger(TouristeService.name);

  constructor(
    @InjectRepository(Touriste)
    private readonly touristeRepository: Repository<Touriste>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async findAll(
    page: number,
    limit: number,
    search?: string
  ): Promise<{ touristes: TouristeDto[]; total: number; page: number; totalPages: number }> {
    try {
      const validLimit = Object.values(ItemsPerPage).includes(limit) ? limit : ItemsPerPage.Ten;

      const queryBuilder = this.touristeRepository
        .createQueryBuilder('touriste')
        .leftJoinAndSelect('touriste.user', 'user');

      if (search) {
        queryBuilder.where(
          'touriste.nationality ILIKE :search OR user.firstName ILIKE :search OR user.lastName ILIKE :search',
          { search: `%${search}%` }
        );
      }

      const [touristes, total] = await queryBuilder
        .skip((page - 1) * validLimit)
        .take(validLimit)
        .orderBy('touriste.createdAt', 'DESC')
        .getManyAndCount();

      const touristeResponse = touristes.map(touriste => new TouristeDto(touriste));
      const totalPages = Math.ceil(total / validLimit);

      return { touristes: touristeResponse, total, page, totalPages };
    } catch (error) {
      this.logger.error('Erreur lors de la récupération des touristes', error);
      throw new InternalServerErrorException('Échec de la récupération des touristes');
    }
  }

  async findOne(id: string): Promise<TouristeDto> {
    const touriste = await this.touristeRepository.findOne({
      where: { id },
      relations: { user: true }
    });

    if (!touriste) {
      throw new NotFoundException(`Touriste avec l'ID ${id} non trouvé`);
    }

    return new TouristeDto(touriste);
  }

  async create(createTouristePayload: CreateTouristePayload): Promise<TouristeDto> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: createTouristePayload.userId }
      });

      if (!user) {
        throw new NotFoundException(`Utilisateur avec l'ID ${createTouristePayload.userId} non trouvé`);
      }

      const existingTouriste = await this.touristeRepository.findOne({
        where: { user: { id: createTouristePayload.userId } }
      });

      if (existingTouriste) {
        throw new BadRequestException('Un touriste existe déjà pour cet utilisateur');
      }

      const newTouriste = this.touristeRepository.create({
        user,
        nationality: createTouristePayload.nationality,
        dateNaissance: new Date(createTouristePayload.dateNaissance)
      });

      const savedTouriste = await this.touristeRepository.save(newTouriste);
      this.logger.log(`Nouveau touriste créé avec succès: ${savedTouriste.id}`);

      return new TouristeDto(savedTouriste);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error('Erreur lors de la création du touriste', error);
      throw new InternalServerErrorException('Échec de la création du touriste');
    }
  }

  async update(id: string, updateTouristePayload: UpdateTouristePayload): Promise<TouristeDto> {
    try {
      const touriste = await this.touristeRepository.findOne({
        where: { id },
        relations: { user: true }
      });

      if (!touriste) {
        throw new NotFoundException(`Touriste avec l'ID ${id} non trouvé`);
      }

      if (updateTouristePayload.nationality !== undefined) {
        touriste.nationality = updateTouristePayload.nationality;
      }

      if (updateTouristePayload.dateNaissance !== undefined) {
        touriste.dateNaissance = new Date(updateTouristePayload.dateNaissance);
      }

      const updatedTouriste = await this.touristeRepository.save(touriste);
      this.logger.log(`Touriste mis à jour avec succès: ${updatedTouriste.id}`);

      return new TouristeDto(updatedTouriste);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error('Erreur lors de la mise à jour du touriste', error);
      throw new InternalServerErrorException('Échec de la mise à jour du touriste');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const touriste = await this.touristeRepository.findOne({ where: { id } });

      if (!touriste) {
        throw new NotFoundException(`Touriste avec l'ID ${id} non trouvé`);
      }

      await this.touristeRepository.remove(touriste);
      this.logger.log(`Touriste supprimé avec succès: ${id}`);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error('Erreur lors de la suppression du touriste', error);
      throw new InternalServerErrorException('Échec de la suppression du touriste');
    }
  }
}
