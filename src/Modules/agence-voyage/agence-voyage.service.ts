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
import { Prestataire } from '../prestataire/entities/prestataire.entity';
import { AgenceVoyageDto } from './dto/agence-voyage.dto';
import { AgenceVoyage } from './entities/agence-voyage.entity';
import { CreateAgenceVoyagePayload } from './payload/create-agence-voyage.payload';
import { UpdateAgenceVoyagePayload } from './payload/update-agence-voyage.payload';

@Injectable()
export class AgenceVoyageService {
  private readonly logger = new Logger(AgenceVoyageService.name);

  constructor(
    @InjectRepository(AgenceVoyage)
    private readonly agenceVoyageRepository: Repository<AgenceVoyage>,
    @InjectRepository(Prestataire)
    private readonly prestataireRepository: Repository<Prestataire>
  ) {}

  async findAll(
    page: number,
    limit: number,
    search?: string
  ): Promise<{ agences: AgenceVoyageDto[]; total: number; page: number; totalPages: number }> {
    try {
      const validLimit = Object.values(ItemsPerPage).includes(limit) ? limit : ItemsPerPage.Ten;

      const queryBuilder = this.agenceVoyageRepository
        .createQueryBuilder('agence')
        .leftJoinAndSelect('agence.prestataire', 'prestataire')
        .leftJoinAndSelect('prestataire.user', 'user');

      if (search) {
        queryBuilder.where(
          'prestataire.nomEntreprise ILIKE :search OR prestataire.ville ILIKE :search OR agence.numLicence ILIKE :search',
          { search: `%${search}%` }
        );
      }

      const [agences, total] = await queryBuilder
        .skip((page - 1) * validLimit)
        .take(validLimit)
        .orderBy('agence.id', 'DESC')
        .getManyAndCount();

      const agenceResponse = agences.map(agence => new AgenceVoyageDto(agence));
      const totalPages = Math.ceil(total / validLimit);

      return { agences: agenceResponse, total, page, totalPages };
    } catch (error) {
      this.logger.error('Erreur lors de la récupération des agences de voyage', error);
      throw new InternalServerErrorException('Échec de la récupération des agences de voyage');
    }
  }

  async findOne(id: string): Promise<AgenceVoyageDto> {
    const agence = await this.agenceVoyageRepository.findOne({
      where: { id },
      relations: { prestataire: { user: true } }
    });

    if (!agence) {
      throw new NotFoundException(`Agence de voyage avec l'ID ${id} non trouvée`);
    }

    return new AgenceVoyageDto(agence);
  }

  async create(createAgenceVoyagePayload: CreateAgenceVoyagePayload): Promise<AgenceVoyageDto> {
    try {
      const prestataire = await this.prestataireRepository.findOne({
        where: { id: createAgenceVoyagePayload.prestataireId },
        relations: { user: true }
      });

      if (!prestataire) {
        throw new NotFoundException(`Prestataire avec l'ID ${createAgenceVoyagePayload.prestataireId} non trouvé`);
      }

      const existingAgence = await this.agenceVoyageRepository.findOne({
        where: { prestataire: { id: createAgenceVoyagePayload.prestataireId } }
      });

      if (existingAgence) {
        throw new BadRequestException('Une agence de voyage existe déjà pour ce prestataire');
      }

      const newAgence = this.agenceVoyageRepository.create({
        prestataire,
        numLicence: createAgenceVoyagePayload.numLicence
      });

      const savedAgence = await this.agenceVoyageRepository.save(newAgence);
      this.logger.log(`Nouvelle agence de voyage créée avec succès: ${savedAgence.id}`);

      return new AgenceVoyageDto(savedAgence);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error("Erreur lors de la création de l'agence de voyage", error);
      throw new InternalServerErrorException("Échec de la création de l'agence de voyage");
    }
  }

  async update(id: string, updateAgenceVoyagePayload: UpdateAgenceVoyagePayload): Promise<AgenceVoyageDto> {
    try {
      const agence = await this.agenceVoyageRepository.findOne({
        where: { id },
        relations: { prestataire: { user: true } }
      });

      if (!agence) {
        throw new NotFoundException(`Agence de voyage avec l'ID ${id} non trouvée`);
      }

      if (updateAgenceVoyagePayload.numLicence !== undefined) {
        agence.numLicence = updateAgenceVoyagePayload.numLicence;
      }

      const updatedAgence = await this.agenceVoyageRepository.save(agence);
      this.logger.log(`Agence de voyage mise à jour avec succès: ${updatedAgence.id}`);

      return new AgenceVoyageDto(updatedAgence);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error("Erreur lors de la mise à jour de l'agence de voyage", error);
      throw new InternalServerErrorException("Échec de la mise à jour de l'agence de voyage");
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const agence = await this.agenceVoyageRepository.findOne({ where: { id } });

      if (!agence) {
        throw new NotFoundException(`Agence de voyage avec l'ID ${id} non trouvée`);
      }

      await this.agenceVoyageRepository.remove(agence);
      this.logger.log(`Agence de voyage supprimée avec succès: ${id}`);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error("Erreur lors de la suppression de l'agence de voyage", error);
      throw new InternalServerErrorException("Échec de la suppression de l'agence de voyage");
    }
  }
}
