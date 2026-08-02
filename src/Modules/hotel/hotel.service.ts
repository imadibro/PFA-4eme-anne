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
import { HotelDto } from './dto/hotel.dto';
import { Hotel } from './entities/hotel.entity';
import { CreateHotelPayload } from './payload/create-hotel.payload';
import { UpdateHotelPayload } from './payload/update-hotel.payload';

@Injectable()
export class HotelService {
  private readonly logger = new Logger(HotelService.name);

  constructor(
    @InjectRepository(Hotel)
    private readonly hotelRepository: Repository<Hotel>,
    @InjectRepository(Prestataire)
    private readonly prestataireRepository: Repository<Prestataire>
  ) {}

  async findAll(page: number, limit: number, search?: string): Promise<PaginatedResult<HotelDto>> {
    try {
      const validLimit = Object.values(ItemsPerPage).includes(limit) ? limit : ItemsPerPage.Ten;

      const queryBuilder = this.hotelRepository
        .createQueryBuilder('hotel')
        .leftJoinAndSelect('hotel.prestataire', 'prestataire')
        .leftJoinAndSelect('prestataire.user', 'user');

      if (search) {
        queryBuilder.where('prestataire.nomEntreprise ILIKE :search OR prestataire.ville ILIKE :search', {
          search: `%${search}%`
        });
      }

      const [hotels, total] = await queryBuilder
        .skip((page - 1) * validLimit)
        .take(validLimit)
        .orderBy('hotel.id', 'DESC')
        .getManyAndCount();

      const hotelResponse = hotels.map(hotel => new HotelDto(hotel));
      const totalPages = Math.ceil(total / validLimit);

      return { data: hotelResponse, total, page, totalPages, limit: validLimit };
    } catch (error) {
      this.logger.error('Erreur lors de la récupération des hôtels', error);
      throw new InternalServerErrorException('Échec de la récupération des hôtels');
    }
  }

  async findOne(id: string): Promise<HotelDto> {
    const hotel = await this.hotelRepository.findOne({
      where: { id },
      relations: { prestataire: { user: true } }
    });

    if (!hotel) {
      throw new NotFoundException(`Hôtel avec l'ID ${id} non trouvé`);
    }

    return new HotelDto(hotel);
  }

  async create(createHotelPayload: CreateHotelPayload): Promise<HotelDto> {
    try {
      const prestataire = await this.prestataireRepository.findOne({
        where: { id: createHotelPayload.prestataireId },
        relations: { user: true }
      });

      if (!prestataire) {
        throw new NotFoundException(`Prestataire avec l'ID ${createHotelPayload.prestataireId} non trouvé`);
      }

      const existingHotel = await this.hotelRepository.findOne({
        where: { prestataire: { id: createHotelPayload.prestataireId } }
      });

      if (existingHotel) {
        throw new BadRequestException('Un hôtel existe déjà pour ce prestataire');
      }

      const newHotel = this.hotelRepository.create({
        prestataire,
        nbrChambre: createHotelPayload.nbrChambre,
        nbrEtoiles: createHotelPayload.nbrEtoiles
      });

      const savedHotel = await this.hotelRepository.save(newHotel);
      this.logger.log(`Nouvel hôtel créé avec succès: ${savedHotel.id}`);

      return new HotelDto(savedHotel);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error("Erreur lors de la création de l'hôtel", error);
      throw new InternalServerErrorException("Échec de la création de l'hôtel");
    }
  }

  async update(id: string, updateHotelPayload: UpdateHotelPayload): Promise<HotelDto> {
    try {
      const hotel = await this.hotelRepository.findOne({
        where: { id },
        relations: { prestataire: { user: true } }
      });

      if (!hotel) {
        throw new NotFoundException(`Hôtel avec l'ID ${id} non trouvé`);
      }

      if (updateHotelPayload.nbrChambre !== undefined) {
        hotel.nbrChambre = updateHotelPayload.nbrChambre;
      }

      if (updateHotelPayload.nbrEtoiles !== undefined) {
        hotel.nbrEtoiles = updateHotelPayload.nbrEtoiles;
      }

      const updatedHotel = await this.hotelRepository.save(hotel);
      this.logger.log(`Hôtel mis à jour avec succès: ${updatedHotel.id}`);

      return new HotelDto(updatedHotel);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error("Erreur lors de la mise à jour de l'hôtel", error);
      throw new InternalServerErrorException("Échec de la mise à jour de l'hôtel");
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const hotel = await this.hotelRepository.findOne({ where: { id } });

      if (!hotel) {
        throw new NotFoundException(`Hôtel avec l'ID ${id} non trouvé`);
      }

      await this.hotelRepository.remove(hotel);
      this.logger.log(`Hôtel supprimé avec succès: ${id}`);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error("Erreur lors de la suppression de l'hôtel", error);
      throw new InternalServerErrorException("Échec de la suppression de l'hôtel");
    }
  }
}
