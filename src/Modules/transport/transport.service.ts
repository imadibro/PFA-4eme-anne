import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemsPerPage, PaginatedResult } from 'src/common';
import { Repository } from 'typeorm';
import { AgenceVoyage } from '../agence-voyage/entities/agence-voyage.entity';
import { TransportDto } from './dto/transport.dto';
import { Transport } from './entities/transport.entity';
import { CreateTransportPayload } from './payload/create-transport.payload';
import { UpdateTransportPayload } from './payload/update-transport.payload';

@Injectable()
export class TransportService {
  private readonly logger = new Logger(TransportService.name);

  constructor(
    @InjectRepository(Transport)
    private readonly transportRepository: Repository<Transport>,
    @InjectRepository(AgenceVoyage)
    private readonly agenceVoyageRepository: Repository<AgenceVoyage>
  ) {}

  async findAll(
    page: number,
    limit: number,
    search?: string,
    agenceVoyageId?: string
  ): Promise<PaginatedResult<TransportDto>> {
    try {
      const validLimit = Object.values(ItemsPerPage).includes(limit) ? limit : ItemsPerPage.Ten;

      const queryBuilder = this.transportRepository
        .createQueryBuilder('transport')
        .leftJoinAndSelect('transport.agenceVoyage', 'agenceVoyage')
        .leftJoinAndSelect('agenceVoyage.prestataire', 'prestataire')
        .leftJoinAndSelect('prestataire.user', 'user');

      if (agenceVoyageId) {
        queryBuilder.andWhere('agenceVoyage.id = :agenceVoyageId', { agenceVoyageId });
      }

      if (search) {
        queryBuilder.andWhere('transport.type ILIKE :search OR CAST(transport.capacite AS TEXT) ILIKE :search', {
          search: `%${search}%`
        });
      }

      const [transports, total] = await queryBuilder
        .skip((page - 1) * validLimit)
        .take(validLimit)
        .orderBy('transport.id', 'DESC')
        .getManyAndCount();

      const transportResponse = transports.map(transport => new TransportDto(transport));
      const totalPages = Math.ceil(total / validLimit);

      return { data: transportResponse, total, page, limit: validLimit, totalPages };
    } catch (error) {
      this.logger.error('Erreur lors de la récupération des transports', error);
      throw new InternalServerErrorException('Échec de la récupération des transports');
    }
  }

  async findOne(id: number): Promise<TransportDto> {
    const transport = await this.transportRepository.findOne({
      where: { id },
      relations: { agenceVoyage: { prestataire: { user: true } } }
    });

    if (!transport) {
      throw new NotFoundException(`Transport avec l'ID ${id} non trouvé`);
    }

    return new TransportDto(transport);
  }

  async create(createTransportPayload: CreateTransportPayload): Promise<TransportDto> {
    try {
      const agenceVoyage = await this.agenceVoyageRepository.findOne({
        where: { id: createTransportPayload.agenceVoyageId },
        relations: { prestataire: { user: true } }
      });

      if (!agenceVoyage) {
        throw new NotFoundException(`Agence de voyage avec l'ID ${createTransportPayload.agenceVoyageId} non trouvée`);
      }

      const newTransport = this.transportRepository.create({
        agenceVoyage,
        type: createTransportPayload.type,
        capacite: createTransportPayload.capacite,
        prixJr: createTransportPayload.prixJr
      });

      const savedTransport = await this.transportRepository.save(newTransport);
      this.logger.log(`Nouveau transport créé avec succès: ${savedTransport.id}`);

      return new TransportDto(savedTransport);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error('Erreur lors de la création du transport', error);
      throw new InternalServerErrorException('Échec de la création du transport');
    }
  }

  async update(id: number, updateTransportPayload: UpdateTransportPayload): Promise<TransportDto> {
    try {
      const transport = await this.transportRepository.findOne({
        where: { id },
        relations: { agenceVoyage: { prestataire: { user: true } } }
      });

      if (!transport) {
        throw new NotFoundException(`Transport avec l'ID ${id} non trouvé`);
      }

      if (updateTransportPayload.type !== undefined) {
        transport.type = updateTransportPayload.type;
      }

      if (updateTransportPayload.capacite !== undefined) {
        transport.capacite = updateTransportPayload.capacite;
      }

      if (updateTransportPayload.prixJr !== undefined) {
        transport.prixJr = updateTransportPayload.prixJr;
      }

      const updatedTransport = await this.transportRepository.save(transport);
      this.logger.log(`Transport mis à jour avec succès: ${updatedTransport.id}`);

      return new TransportDto(updatedTransport);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error('Erreur lors de la mise à jour du transport', error);
      throw new InternalServerErrorException('Échec de la mise à jour du transport');
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const transport = await this.transportRepository.findOne({ where: { id } });

      if (!transport) {
        throw new NotFoundException(`Transport avec l'ID ${id} non trouvé`);
      }

      await this.transportRepository.remove(transport);
      this.logger.log(`Transport supprimé avec succès: ${id}`);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error('Erreur lors de la suppression du transport', error);
      throw new InternalServerErrorException('Échec de la suppression du transport');
    }
  }
}
