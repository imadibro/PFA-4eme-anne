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
import { CircuitDto } from './dto/circuit.dto';
import { Circuit } from './entities/circuit.entity';
import { CreateCircuitPayload } from './payload/create-circuit.payload';
import { UpdateCircuitPayload } from './payload/update-circuit.payload';

@Injectable()
export class CircuitService {
  private readonly logger = new Logger(CircuitService.name);

  constructor(
    @InjectRepository(Circuit)
    private readonly circuitRepository: Repository<Circuit>
  ) {}

  async findAll(
    page: number,
    limit: number,
    search?: string
  ): Promise<{ circuits: CircuitDto[]; total: number; page: number; totalPages: number }> {
    try {
      const validLimit = Object.values(ItemsPerPage).includes(limit) ? limit : ItemsPerPage.Ten;

      const queryBuilder = this.circuitRepository.createQueryBuilder('circuit');

      if (search) {
        queryBuilder.where('circuit.title ILIKE :search OR CAST(circuit.dureeJours AS TEXT) ILIKE :search', {
          search: `%${search}%`
        });
      }

      const [circuits, total] = await queryBuilder
        .skip((page - 1) * validLimit)
        .take(validLimit)
        .orderBy('circuit.id', 'DESC')
        .getManyAndCount();

      const circuitResponse = circuits.map(circuit => new CircuitDto(circuit));
      const totalPages = Math.ceil(total / validLimit);

      return { circuits: circuitResponse, total, page, totalPages };
    } catch (error) {
      this.logger.error('Erreur lors de la récupération des circuits', error);
      throw new InternalServerErrorException('Échec de la récupération des circuits');
    }
  }

  async findOne(id: number): Promise<CircuitDto> {
    const circuit = await this.circuitRepository.findOne({ where: { id } });

    if (!circuit) {
      throw new NotFoundException(`Circuit avec l'ID ${id} non trouvé`);
    }

    return new CircuitDto(circuit);
  }

  async create(createCircuitPayload: CreateCircuitPayload): Promise<CircuitDto> {
    try {
      const existingCircuit = await this.circuitRepository.findOne({
        where: { title: createCircuitPayload.title }
      });

      if (existingCircuit) {
        throw new BadRequestException(`Un circuit avec le titre "${createCircuitPayload.title}" existe déjà`);
      }

      const newCircuit = this.circuitRepository.create({
        title: createCircuitPayload.title,
        prix: createCircuitPayload.prix,
        dureeJours: createCircuitPayload.dureeJours
      });

      const savedCircuit = await this.circuitRepository.save(newCircuit);
      this.logger.log(`Nouveau circuit créé avec succès: ${savedCircuit.id}`);

      return new CircuitDto(savedCircuit);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error('Erreur lors de la création du circuit', error);
      throw new InternalServerErrorException('Échec de la création du circuit');
    }
  }

  async update(id: number, updateCircuitPayload: UpdateCircuitPayload): Promise<CircuitDto> {
    try {
      const circuit = await this.circuitRepository.findOne({ where: { id } });

      if (!circuit) {
        throw new NotFoundException(`Circuit avec l'ID ${id} non trouvé`);
      }

      if (updateCircuitPayload.title !== undefined) {
        const existingCircuit = await this.circuitRepository.findOne({
          where: { title: updateCircuitPayload.title }
        });

        if (existingCircuit && existingCircuit.id !== id) {
          throw new BadRequestException(`Un circuit avec le titre "${updateCircuitPayload.title}" existe déjà`);
        }

        circuit.title = updateCircuitPayload.title;
      }

      if (updateCircuitPayload.prix !== undefined) {
        circuit.prix = updateCircuitPayload.prix;
      }

      if (updateCircuitPayload.dureeJours !== undefined) {
        circuit.dureeJours = updateCircuitPayload.dureeJours;
      }

      const updatedCircuit = await this.circuitRepository.save(circuit);
      this.logger.log(`Circuit mis à jour avec succès: ${updatedCircuit.id}`);

      return new CircuitDto(updatedCircuit);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error('Erreur lors de la mise à jour du circuit', error);
      throw new InternalServerErrorException('Échec de la mise à jour du circuit');
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const circuit = await this.circuitRepository.findOne({ where: { id } });

      if (!circuit) {
        throw new NotFoundException(`Circuit avec l'ID ${id} non trouvé`);
      }

      await this.circuitRepository.remove(circuit);
      this.logger.log(`Circuit supprimé avec succès: ${id}`);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error('Erreur lors de la suppression du circuit', error);
      throw new InternalServerErrorException('Échec de la suppression du circuit');
    }
  }
}
