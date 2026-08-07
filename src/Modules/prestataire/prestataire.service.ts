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
import { User } from '../user/entities/user.entity';
import { PrestataireDto } from './dto/prestataire.dto';
import { Prestataire } from './entities/prestataire.entity';
import { CreatePrestatairePayload } from './payload/create-prestataire.payload';
import { UpdatePrestatairePayload } from './payload/update-prestataire.payload';

@Injectable()
export class PrestataireService {
  private readonly logger = new Logger(PrestataireService.name);

  constructor(
    @InjectRepository(Prestataire)
    private readonly prestataireRepository: Repository<Prestataire>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async findAll(page: number, limit: number, search?: string): Promise<PaginatedResult<PrestataireDto>> {
    try {
      const validLimit = Object.values(ItemsPerPage).includes(limit) ? limit : ItemsPerPage.Ten;

      const queryBuilder = this.prestataireRepository
        .createQueryBuilder('prestataire')
        .leftJoinAndSelect('prestataire.user', 'user');

      if (search) {
        queryBuilder.where(
          'prestataire.nomEntreprise ILIKE :search OR prestataire.ville ILIKE :search OR user.firstName ILIKE :search OR user.lastName ILIKE :search',
          { search: `%${search}%` }
        );
      }

      const [prestataires, total] = await queryBuilder
        .skip((page - 1) * validLimit)
        .take(validLimit)
        .orderBy('prestataire.id', 'DESC')
        .getManyAndCount();

      const prestataireResponse = prestataires.map(prestataire => new PrestataireDto(prestataire));
      const totalPages = Math.ceil(total / validLimit);

      return { data: prestataireResponse, total, page, limit: validLimit, totalPages };
    } catch (error) {
      this.logger.error('Erreur lors de la récupération des prestataires', error);
      throw new InternalServerErrorException('Échec de la récupération des prestataires');
    }
  }

  async findOne(id: string): Promise<PrestataireDto> {
    const prestataire = await this.prestataireRepository.findOne({
      where: { id },
      relations: { user: true }
    });

    if (!prestataire) {
      throw new NotFoundException(`Prestataire avec l'ID ${id} non trouvé`);
    }

    return new PrestataireDto(prestataire);
  }

  async create(createPrestatairePayload: CreatePrestatairePayload): Promise<PrestataireDto> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: createPrestatairePayload.userId }
      });

      if (!user) {
        throw new NotFoundException(`Utilisateur avec l'ID ${createPrestatairePayload.userId} non trouvé`);
      }

      const existingPrestataire = await this.prestataireRepository.findOne({
        where: { user: { id: createPrestatairePayload.userId } }
      });

      if (existingPrestataire) {
        throw new BadRequestException('Un prestataire existe déjà pour cet utilisateur');
      }

      const newPrestataire = this.prestataireRepository.create({
        user,
        nomEntreprise: createPrestatairePayload.nomEntreprise,
        adress: createPrestatairePayload.adress,
        ville: createPrestatairePayload.ville,
        localisation: createPrestatairePayload.localisation
      });

      const savedPrestataire = await this.prestataireRepository.save(newPrestataire);
      this.logger.log(`Nouveau prestataire créé avec succès: ${savedPrestataire.id}`);

      return new PrestataireDto(savedPrestataire);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error('Erreur lors de la création du prestataire', error);
      throw new InternalServerErrorException('Échec de la création du prestataire');
    }
  }

  async update(id: string, updatePrestatairePayload: UpdatePrestatairePayload): Promise<PrestataireDto> {
    try {
      const prestataire = await this.prestataireRepository.findOne({
        where: { id },
        relations: { user: true }
      });

      if (!prestataire) {
        throw new NotFoundException(`Prestataire avec l'ID ${id} non trouvé`);
      }

      if (updatePrestatairePayload.nomEntreprise !== undefined) {
        prestataire.nomEntreprise = updatePrestatairePayload.nomEntreprise;
      }

      if (updatePrestatairePayload.adress !== undefined) {
        prestataire.adress = updatePrestatairePayload.adress;
      }

      if (updatePrestatairePayload.ville !== undefined) {
        prestataire.ville = updatePrestatairePayload.ville;
      }

      if (updatePrestatairePayload.localisation !== undefined) {
        prestataire.localisation = updatePrestatairePayload.localisation;
      }

      const updatedPrestataire = await this.prestataireRepository.save(prestataire);
      this.logger.log(`Prestataire mis à jour avec succès: ${updatedPrestataire.id}`);

      return new PrestataireDto(updatedPrestataire);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error('Erreur lors de la mise à jour du prestataire', error);
      throw new InternalServerErrorException('Échec de la mise à jour du prestataire');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const prestataire = await this.prestataireRepository.findOne({ where: { id } });

      if (!prestataire) {
        throw new NotFoundException(`Prestataire avec l'ID ${id} non trouvé`);
      }

      await this.prestataireRepository.remove(prestataire);
      this.logger.log(`Prestataire supprimé avec succès: ${id}`);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error('Erreur lors de la suppression du prestataire', error);
      throw new InternalServerErrorException('Échec de la suppression du prestataire');
    }
  }

  async findByUserId(userId: string): Promise<PrestataireDto | null> {
    const prestataire = await this.prestataireRepository.findOne({
      where: { user: { id: userId } },
      relations: { user: true }
    });

    if (!prestataire) {
      return null;
    }

    return new PrestataireDto(prestataire);
  }

  async verifyOwnership(prestataireId: string, userId: string): Promise<boolean> {
    const prestataire = await this.prestataireRepository.findOne({
      where: { id: prestataireId },
      relations: { user: true }
    });

    if (!prestataire) {
      throw new NotFoundException(`Prestataire avec l'ID ${prestataireId} non trouvé`);
    }

    return prestataire.user.id === userId;
  }
}
