import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemsPerPage, PaginatedResult } from 'src/common';
import { In, Repository } from 'typeorm';
import { AgenceVoyage } from '../agence-voyage/entities/agence-voyage.entity';
import { Circuit } from '../circuit/entities/circuit.entity';
import { Guide } from '../Modules/guide/entities/guide.entity';
import { Hotel } from '../Modules/hotel/entities/hotel.entity';
import { Restaurant } from '../Modules/restaurant/entities/restaurant.entity';
import { Transport } from '../transport/entities/transport.entity';
import { PackVoyageDto } from './dto/pack-voyage.dto';
import { PackVoyage } from './entities/pack-voyage.entity';
import { CreatePackVoyagePayload } from './payload/create-pack-voyage.payload';
import { UpdatePackVoyagePayload } from './payload/update-pack-voyage.payload';

@Injectable()
export class PackVoyageService {
  private readonly logger = new Logger(PackVoyageService.name);

  constructor(
    @InjectRepository(PackVoyage)
    private readonly packVoyageRepository: Repository<PackVoyage>,
    @InjectRepository(AgenceVoyage)
    private readonly agenceVoyageRepository: Repository<AgenceVoyage>,
    @InjectRepository(Guide)
    private readonly guideRepository: Repository<Guide>,
    @InjectRepository(Hotel)
    private readonly hotelRepository: Repository<Hotel>,
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
    @InjectRepository(Transport)
    private readonly transportRepository: Repository<Transport>,
    @InjectRepository(Circuit)
    private readonly circuitRepository: Repository<Circuit>
  ) {}

  async findAll(page: number, limit: number, search?: string): Promise<PaginatedResult<PackVoyageDto>> {
    try {
      const validLimit = Object.values(ItemsPerPage).includes(limit) ? limit : ItemsPerPage.Ten;

      const queryBuilder = this.packVoyageRepository
        .createQueryBuilder('pack')
        .leftJoinAndSelect('pack.agenceVoyage', 'agenceVoyage')
        .leftJoinAndSelect('agenceVoyage.prestataire', 'prestataire')
        .leftJoinAndSelect('prestataire.user', 'user')
        .leftJoinAndSelect('pack.circuit', 'circuit')
        .leftJoinAndSelect('pack.guides', 'guides')
        .leftJoinAndSelect('pack.hotels', 'hotels')
        .leftJoinAndSelect('pack.restaurants', 'restaurants')
        .leftJoinAndSelect('pack.transports', 'transports');

      if (search) {
        queryBuilder.where('pack.nom ILIKE :search OR pack.description ILIKE :search OR pack.typePack ILIKE :search', {
          search: `%${search}%`
        });
      }

      const [packs, total] = await queryBuilder
        .skip((page - 1) * validLimit)
        .take(validLimit)
        .orderBy('pack.id', 'DESC')
        .getManyAndCount();

      const packResponse = packs.map(pack => new PackVoyageDto(pack));
      const totalPages = Math.ceil(total / validLimit);

      return { data: packResponse, total, page, limit: validLimit, totalPages };
    } catch (error) {
      this.logger.error('Erreur lors de la récupération des packs voyage', error);
      throw new InternalServerErrorException('Échec de la récupération des packs voyage');
    }
  }

  async findOne(id: number): Promise<PackVoyageDto> {
    const pack = await this.packVoyageRepository.findOne({
      where: { id },
      relations: {
        agenceVoyage: { prestataire: { user: true } },
        circuit: true,
        guides: true,
        hotels: true,
        restaurants: true,
        transports: true
      }
    });

    if (!pack) {
      throw new NotFoundException(`Pack voyage avec l'ID ${id} non trouvé`);
    }

    return new PackVoyageDto(pack);
  }

  async create(createPackVoyagePayload: CreatePackVoyagePayload): Promise<PackVoyageDto> {
    try {
      const agenceVoyage = await this.agenceVoyageRepository.findOne({
        where: { id: createPackVoyagePayload.agenceVoyageId },
        relations: { prestataire: { user: true } }
      });

      if (!agenceVoyage) {
        throw new NotFoundException(`Agence de voyage avec l'ID ${createPackVoyagePayload.agenceVoyageId} non trouvée`);
      }

      const existingPack = await this.packVoyageRepository.findOne({
        where: { nom: createPackVoyagePayload.nom }
      });

      if (existingPack) {
        throw new BadRequestException(`Un pack voyage avec le nom "${createPackVoyagePayload.nom}" existe déjà`);
      }

      let circuit: Circuit | undefined = undefined;
      if (createPackVoyagePayload.circuitId) {
        const foundCircuit = await this.circuitRepository.findOne({ where: { id: createPackVoyagePayload.circuitId } });
        if (!foundCircuit) {
          throw new NotFoundException(`Circuit avec l'ID ${createPackVoyagePayload.circuitId} non trouvé`);
        }
        circuit = foundCircuit;
      }

      let guides: Guide[] = [];
      if (createPackVoyagePayload.guideIds && createPackVoyagePayload.guideIds.length > 0) {
        guides = await this.guideRepository.find({ where: { id: In(createPackVoyagePayload.guideIds) } });
        if (guides.length !== createPackVoyagePayload.guideIds.length) {
          throw new NotFoundException('Un ou plusieurs guides non trouvés');
        }
      }

      let hotels: Hotel[] = [];
      if (createPackVoyagePayload.hotelIds && createPackVoyagePayload.hotelIds.length > 0) {
        hotels = await this.hotelRepository.find({ where: { id: In(createPackVoyagePayload.hotelIds) } });
        if (hotels.length !== createPackVoyagePayload.hotelIds.length) {
          throw new NotFoundException('Un ou plusieurs hôtels non trouvés');
        }
      }

      let restaurants: Restaurant[] = [];
      if (createPackVoyagePayload.restaurantIds && createPackVoyagePayload.restaurantIds.length > 0) {
        restaurants = await this.restaurantRepository.find({
          where: { id: In(createPackVoyagePayload.restaurantIds) }
        });
        if (restaurants.length !== createPackVoyagePayload.restaurantIds.length) {
          throw new NotFoundException('Un ou plusieurs restaurants non trouvés');
        }
      }

      let transports: Transport[] = [];
      if (createPackVoyagePayload.transportIds && createPackVoyagePayload.transportIds.length > 0) {
        transports = await this.transportRepository.find({ where: { id: In(createPackVoyagePayload.transportIds) } });
        if (transports.length !== createPackVoyagePayload.transportIds.length) {
          throw new NotFoundException('Un ou plusieurs transports non trouvés');
        }
      }

      const newPack = this.packVoyageRepository.create({
        agenceVoyage,
        nom: createPackVoyagePayload.nom,
        description: createPackVoyagePayload.description,
        prix: createPackVoyagePayload.prix,
        typePack: createPackVoyagePayload.typePack,
        circuit,
        guides,
        hotels,
        restaurants,
        transports
      });

      const savedPack = await this.packVoyageRepository.save(newPack);
      this.logger.log(`Nouveau pack voyage créé avec succès: ${savedPack.id}`);

      return this.findOne(savedPack.id);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error('Erreur lors de la création du pack voyage', error);
      throw new InternalServerErrorException('Échec de la création du pack voyage');
    }
  }

  async update(id: number, updatePackVoyagePayload: UpdatePackVoyagePayload): Promise<PackVoyageDto> {
    try {
      const pack = await this.packVoyageRepository.findOne({
        where: { id },
        relations: { circuit: true, guides: true, hotels: true, restaurants: true, transports: true }
      });

      if (!pack) {
        throw new NotFoundException(`Pack voyage avec l'ID ${id} non trouvé`);
      }

      if (updatePackVoyagePayload.nom !== undefined) {
        const existingPack = await this.packVoyageRepository.findOne({
          where: { nom: updatePackVoyagePayload.nom }
        });

        if (existingPack && existingPack.id !== id) {
          throw new BadRequestException(`Un pack voyage avec le nom "${updatePackVoyagePayload.nom}" existe déjà`);
        }

        pack.nom = updatePackVoyagePayload.nom;
      }

      if (updatePackVoyagePayload.description !== undefined) {
        pack.description = updatePackVoyagePayload.description;
      }

      if (updatePackVoyagePayload.prix !== undefined) {
        pack.prix = updatePackVoyagePayload.prix;
      }

      if (updatePackVoyagePayload.typePack !== undefined) {
        pack.typePack = updatePackVoyagePayload.typePack;
      }

      if (updatePackVoyagePayload.circuitId !== undefined) {
        const circuit = await this.circuitRepository.findOne({ where: { id: updatePackVoyagePayload.circuitId } });
        if (!circuit) {
          throw new NotFoundException(`Circuit avec l'ID ${updatePackVoyagePayload.circuitId} non trouvé`);
        }
        pack.circuit = circuit;
      }

      if (updatePackVoyagePayload.guideIds !== undefined) {
        const guides = await this.guideRepository.find({ where: { id: In(updatePackVoyagePayload.guideIds) } });
        if (guides.length !== updatePackVoyagePayload.guideIds.length) {
          throw new NotFoundException('Un ou plusieurs guides non trouvés');
        }
        pack.guides = guides;
      }

      if (updatePackVoyagePayload.hotelIds !== undefined) {
        const hotels = await this.hotelRepository.find({ where: { id: In(updatePackVoyagePayload.hotelIds) } });
        if (hotels.length !== updatePackVoyagePayload.hotelIds.length) {
          throw new NotFoundException('Un ou plusieurs hôtels non trouvés');
        }
        pack.hotels = hotels;
      }

      if (updatePackVoyagePayload.restaurantIds !== undefined) {
        const restaurants = await this.restaurantRepository.find({
          where: { id: In(updatePackVoyagePayload.restaurantIds) }
        });
        if (restaurants.length !== updatePackVoyagePayload.restaurantIds.length) {
          throw new NotFoundException('Un ou plusieurs restaurants non trouvés');
        }
        pack.restaurants = restaurants;
      }

      if (updatePackVoyagePayload.transportIds !== undefined) {
        const transports = await this.transportRepository.find({
          where: { id: In(updatePackVoyagePayload.transportIds) }
        });
        if (transports.length !== updatePackVoyagePayload.transportIds.length) {
          throw new NotFoundException('Un ou plusieurs transports non trouvés');
        }
        pack.transports = transports;
      }

      await this.packVoyageRepository.save(pack);
      this.logger.log(`Pack voyage mis à jour avec succès: ${id}`);

      return this.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error('Erreur lors de la mise à jour du pack voyage', error);
      throw new InternalServerErrorException('Échec de la mise à jour du pack voyage');
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const pack = await this.packVoyageRepository.findOne({ where: { id } });

      if (!pack) {
        throw new NotFoundException(`Pack voyage avec l'ID ${id} non trouvé`);
      }

      await this.packVoyageRepository.remove(pack);
      this.logger.log(`Pack voyage supprimé avec succès: ${id}`);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error('Erreur lors de la suppression du pack voyage', error);
      throw new InternalServerErrorException('Échec de la suppression du pack voyage');
    }
  }
}
