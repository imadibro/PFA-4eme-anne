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
import { RestaurantDto } from './dto/restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';
import { CreateRestaurantPayload } from './payload/create-restaurant.payload';
import { UpdateRestaurantPayload } from './payload/update-restaurant.payload';

@Injectable()
export class RestaurantService {
  private readonly logger = new Logger(RestaurantService.name);

  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
    @InjectRepository(Prestataire)
    private readonly prestataireRepository: Repository<Prestataire>
  ) {}

  async findAll(
    page: number,
    limit: number,
    search?: string
  ): Promise<{ restaurants: RestaurantDto[]; total: number; page: number; totalPages: number }> {
    try {
      const validLimit = Object.values(ItemsPerPage).includes(limit) ? limit : ItemsPerPage.Ten;

      const queryBuilder = this.restaurantRepository
        .createQueryBuilder('restaurant')
        .leftJoinAndSelect('restaurant.prestataire', 'prestataire')
        .leftJoinAndSelect('prestataire.user', 'user');

      if (search) {
        queryBuilder.where(
          'prestataire.nomEntreprise ILIKE :search OR prestataire.ville ILIKE :search OR restaurant.typeCuisin ILIKE :search',
          { search: `%${search}%` }
        );
      }

      const [restaurants, total] = await queryBuilder
        .skip((page - 1) * validLimit)
        .take(validLimit)
        .orderBy('restaurant.id', 'DESC')
        .getManyAndCount();

      const restaurantResponse = restaurants.map(restaurant => new RestaurantDto(restaurant));
      const totalPages = Math.ceil(total / validLimit);

      return { restaurants: restaurantResponse, total, page, totalPages };
    } catch (error) {
      this.logger.error('Erreur lors de la récupération des restaurants', error);
      throw new InternalServerErrorException('Échec de la récupération des restaurants');
    }
  }

  async findOne(id: string): Promise<RestaurantDto> {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id },
      relations: { prestataire: { user: true } }
    });

    if (!restaurant) {
      throw new NotFoundException(`Restaurant avec l'ID ${id} non trouvé`);
    }

    return new RestaurantDto(restaurant);
  }

  async create(createRestaurantPayload: CreateRestaurantPayload): Promise<RestaurantDto> {
    try {
      const prestataire = await this.prestataireRepository.findOne({
        where: { id: createRestaurantPayload.prestataireId },
        relations: { user: true }
      });

      if (!prestataire) {
        throw new NotFoundException(`Prestataire avec l'ID ${createRestaurantPayload.prestataireId} non trouvé`);
      }

      const existingRestaurant = await this.restaurantRepository.findOne({
        where: { prestataire: { id: createRestaurantPayload.prestataireId } }
      });

      if (existingRestaurant) {
        throw new BadRequestException('Un restaurant existe déjà pour ce prestataire');
      }

      const newRestaurant = this.restaurantRepository.create({
        prestataire,
        typeCuisin: createRestaurantPayload.typeCuisin,
        horaire: createRestaurantPayload.horaire
      });

      const savedRestaurant = await this.restaurantRepository.save(newRestaurant);
      this.logger.log(`Nouveau restaurant créé avec succès: ${savedRestaurant.id}`);

      return new RestaurantDto(savedRestaurant);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error('Erreur lors de la création du restaurant', error);
      throw new InternalServerErrorException('Échec de la création du restaurant');
    }
  }

  async update(id: string, updateRestaurantPayload: UpdateRestaurantPayload): Promise<RestaurantDto> {
    try {
      const restaurant = await this.restaurantRepository.findOne({
        where: { id },
        relations: { prestataire: { user: true } }
      });

      if (!restaurant) {
        throw new NotFoundException(`Restaurant avec l'ID ${id} non trouvé`);
      }

      if (updateRestaurantPayload.typeCuisin !== undefined) {
        restaurant.typeCuisin = updateRestaurantPayload.typeCuisin;
      }

      if (updateRestaurantPayload.horaire !== undefined) {
        restaurant.horaire = updateRestaurantPayload.horaire;
      }

      const updatedRestaurant = await this.restaurantRepository.save(restaurant);
      this.logger.log(`Restaurant mis à jour avec succès: ${updatedRestaurant.id}`);

      return new RestaurantDto(updatedRestaurant);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error('Erreur lors de la mise à jour du restaurant', error);
      throw new InternalServerErrorException('Échec de la mise à jour du restaurant');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const restaurant = await this.restaurantRepository.findOne({ where: { id } });

      if (!restaurant) {
        throw new NotFoundException(`Restaurant avec l'ID ${id} non trouvé`);
      }

      await this.restaurantRepository.remove(restaurant);
      this.logger.log(`Restaurant supprimé avec succès: ${id}`);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error('Erreur lors de la suppression du restaurant', error);
      throw new InternalServerErrorException('Échec de la suppression du restaurant');
    }
  }
}
