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
import { Hotel } from '../hotel/entities/hotel.entity';
import { ChambreDto } from './dto/chambre.dto';
import { Chambre } from './entities/chambre.entity';
import { CreateChambrePayload } from './payload/create-chambre.payload';
import { UpdateChambrePayload } from './payload/update-chambre.payload';

@Injectable()
export class ChambreService {
  private readonly logger = new Logger(ChambreService.name);

  constructor(
    @InjectRepository(Chambre)
    private readonly chambreRepository: Repository<Chambre>,
    @InjectRepository(Hotel)
    private readonly hotelRepository: Repository<Hotel>
  ) {}

  async findAll(
    page: number,
    limit: number,
    search?: string,
    hotelId?: string
  ): Promise<{ chambres: ChambreDto[]; total: number; page: number; totalPages: number }> {
    try {
      const validLimit = Object.values(ItemsPerPage).includes(limit) ? limit : ItemsPerPage.Ten;

      const queryBuilder = this.chambreRepository
        .createQueryBuilder('chambre')
        .leftJoinAndSelect('chambre.hotel', 'hotel')
        .leftJoinAndSelect('hotel.prestataire', 'prestataire')
        .leftJoinAndSelect('prestataire.user', 'user');

      if (hotelId) {
        queryBuilder.andWhere('hotel.id = :hotelId', { hotelId });
      }

      if (search) {
        queryBuilder.andWhere('chambre.type ILIKE :search OR chambre.numero ILIKE :search', { search: `%${search}%` });
      }

      const [chambres, total] = await queryBuilder
        .skip((page - 1) * validLimit)
        .take(validLimit)
        .orderBy('chambre.id', 'DESC')
        .getManyAndCount();

      const chambreResponse = chambres.map(chambre => new ChambreDto(chambre));
      const totalPages = Math.ceil(total / validLimit);

      return { chambres: chambreResponse, total, page, totalPages };
    } catch (error) {
      this.logger.error('Erreur lors de la récupération des chambres', error);
      throw new InternalServerErrorException('Échec de la récupération des chambres');
    }
  }

  async findOne(id: number): Promise<ChambreDto> {
    const chambre = await this.chambreRepository.findOne({
      where: { id },
      relations: { hotel: { prestataire: { user: true } } }
    });

    if (!chambre) {
      throw new NotFoundException(`Chambre avec l'ID ${id} non trouvée`);
    }

    return new ChambreDto(chambre);
  }

  async create(createChambrePayload: CreateChambrePayload): Promise<ChambreDto> {
    try {
      const hotel = await this.hotelRepository.findOne({
        where: { id: createChambrePayload.hotelId },
        relations: { prestataire: { user: true } }
      });

      if (!hotel) {
        throw new NotFoundException(`Hôtel avec l'ID ${createChambrePayload.hotelId} non trouvé`);
      }

      const existingChambre = await this.chambreRepository.findOne({
        where: {
          hotel: { id: createChambrePayload.hotelId },
          numero: createChambrePayload.numero
        }
      });

      if (existingChambre) {
        throw new BadRequestException(`La chambre numéro ${createChambrePayload.numero} existe déjà dans cet hôtel`);
      }

      const newChambre = this.chambreRepository.create({
        hotel,
        numero: createChambrePayload.numero,
        type: createChambrePayload.type,
        prixNuit: createChambrePayload.prixNuit,
        estDisponible: createChambrePayload.estDisponible ?? true
      });

      const savedChambre = await this.chambreRepository.save(newChambre);
      this.logger.log(`Nouvelle chambre créée avec succès: ${savedChambre.id}`);

      return new ChambreDto(savedChambre);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error('Erreur lors de la création de la chambre', error);
      throw new InternalServerErrorException('Échec de la création de la chambre');
    }
  }

  async update(id: number, updateChambrePayload: UpdateChambrePayload): Promise<ChambreDto> {
    try {
      const chambre = await this.chambreRepository.findOne({
        where: { id },
        relations: { hotel: { prestataire: { user: true } } }
      });

      if (!chambre) {
        throw new NotFoundException(`Chambre avec l'ID ${id} non trouvée`);
      }

      if (updateChambrePayload.numero !== undefined) {
        const existingChambre = await this.chambreRepository.findOne({
          where: {
            hotel: { id: chambre.hotel.id },
            numero: updateChambrePayload.numero
          }
        });

        if (existingChambre && existingChambre.id !== id) {
          throw new BadRequestException(`La chambre numéro ${updateChambrePayload.numero} existe déjà dans cet hôtel`);
        }

        chambre.numero = updateChambrePayload.numero;
      }

      if (updateChambrePayload.type !== undefined) {
        chambre.type = updateChambrePayload.type;
      }

      if (updateChambrePayload.prixNuit !== undefined) {
        chambre.prixNuit = updateChambrePayload.prixNuit;
      }

      if (updateChambrePayload.estDisponible !== undefined) {
        chambre.estDisponible = updateChambrePayload.estDisponible;
      }

      const updatedChambre = await this.chambreRepository.save(chambre);
      this.logger.log(`Chambre mise à jour avec succès: ${updatedChambre.id}`);

      return new ChambreDto(updatedChambre);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error('Erreur lors de la mise à jour de la chambre', error);
      throw new InternalServerErrorException('Échec de la mise à jour de la chambre');
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const chambre = await this.chambreRepository.findOne({ where: { id } });

      if (!chambre) {
        throw new NotFoundException(`Chambre avec l'ID ${id} non trouvée`);
      }

      await this.chambreRepository.remove(chambre);
      this.logger.log(`Chambre supprimée avec succès: ${id}`);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error('Erreur lors de la suppression de la chambre', error);
      throw new InternalServerErrorException('Échec de la suppression de la chambre');
    }
  }
}
