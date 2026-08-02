import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemsPerPage } from 'src/common';
import { Repository } from 'typeorm';
import { Prestataire } from '../prestataire/entities/prestataire.entity';
import { Touriste } from '../touriste/entities/touriste.entity';
import { AvisDto } from './dto/avis.dto';
import { Avis } from './entities/avis.entity';
import { CreateAvisPayload } from './payload/create-avis.payload';
import { UpdateAvisPayload } from './payload/update-avis.payload';

@Injectable()
export class AvisService {
  private readonly logger = new Logger(AvisService.name);

  constructor(
    @InjectRepository(Avis)
    private readonly avisRepository: Repository<Avis>,
    @InjectRepository(Touriste)
    private readonly touristeRepository: Repository<Touriste>,
    @InjectRepository(Prestataire)
    private readonly prestataireRepository: Repository<Prestataire>
  ) {}

  async findAll(
    page: number,
    limit: number,
    search?: string
  ): Promise<{ avis: AvisDto[]; total: number; page: number; totalPages: number }> {
    try {
      const validLimit = Object.values(ItemsPerPage).includes(limit) ? limit : ItemsPerPage.Ten;

      const queryBuilder = this.avisRepository
        .createQueryBuilder('avis')
        .leftJoinAndSelect('avis.touriste', 'touriste')
        .leftJoinAndSelect('touriste.user', 'touristeUser')
        .leftJoinAndSelect('avis.prestataire', 'prestataire')
        .leftJoinAndSelect('prestataire.user', 'prestataireUser');

      if (search) {
        queryBuilder.where('avis.commentaire ILIKE :search OR CAST(avis.note AS TEXT) ILIKE :search', {
          search: `%${search}%`
        });
      }

      const [avisList, total] = await queryBuilder
        .skip((page - 1) * validLimit)
        .take(validLimit)
        .orderBy('avis.id', 'DESC')
        .getManyAndCount();

      const avisResponse = avisList.map(avis => new AvisDto(avis));
      const totalPages = Math.ceil(total / validLimit);

      return { avis: avisResponse, total, page, totalPages };
    } catch (error) {
      this.logger.error('Erreur lors de la récupération des avis', error);
      throw new InternalServerErrorException('Échec de la récupération des avis');
    }
  }

  async findOne(id: number): Promise<AvisDto> {
    const avis = await this.avisRepository.findOne({
      where: { id },
      relations: {
        touriste: { user: true },
        prestataire: { user: true }
      }
    });

    if (!avis) {
      throw new NotFoundException(`Avis avec l'ID ${id} non trouvé`);
    }

    return new AvisDto(avis);
  }

  async create(createAvisPayload: CreateAvisPayload): Promise<AvisDto> {
    try {
      const touriste = await this.touristeRepository.findOne({
        where: { id: createAvisPayload.touristeId },
        relations: { user: true }
      });

      if (!touriste) {
        throw new NotFoundException(`Touriste avec l'ID ${createAvisPayload.touristeId} non trouvé`);
      }

      const prestataire = await this.prestataireRepository.findOne({
        where: { id: createAvisPayload.prestataireId },
        relations: { user: true }
      });

      if (!prestataire) {
        throw new NotFoundException(`Prestataire avec l'ID ${createAvisPayload.prestataireId} non trouvé`);
      }

      const newAvis = this.avisRepository.create({
        touriste,
        prestataire,
        note: createAvisPayload.note,
        commentaire: createAvisPayload.commentaire,
        dateAvis: new Date(createAvisPayload.dateAvis)
      });

      const savedAvis = await this.avisRepository.save(newAvis);
      this.logger.log(`Nouvel avis créé avec succès: ${savedAvis.id}`);

      return this.findOne(savedAvis.id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error("Erreur lors de la création de l'avis", error);
      throw new InternalServerErrorException("Échec de la création de l'avis");
    }
  }

  async update(id: number, updateAvisPayload: UpdateAvisPayload): Promise<AvisDto> {
    try {
      const avis = await this.avisRepository.findOne({
        where: { id },
        relations: { touriste: { user: true }, prestataire: { user: true } }
      });

      if (!avis) {
        throw new NotFoundException(`Avis avec l'ID ${id} non trouvé`);
      }

      if (updateAvisPayload.note !== undefined) {
        avis.note = updateAvisPayload.note;
      }

      if (updateAvisPayload.commentaire !== undefined) {
        avis.commentaire = updateAvisPayload.commentaire;
      }

      if (updateAvisPayload.dateAvis !== undefined) {
        avis.dateAvis = new Date(updateAvisPayload.dateAvis);
      }

      const updatedAvis = await this.avisRepository.save(avis);
      this.logger.log(`Avis mis à jour avec succès: ${updatedAvis.id}`);

      return new AvisDto(updatedAvis);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error("Erreur lors de la mise à jour de l'avis", error);
      throw new InternalServerErrorException("Échec de la mise à jour de l'avis");
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const avis = await this.avisRepository.findOne({ where: { id } });

      if (!avis) {
        throw new NotFoundException(`Avis avec l'ID ${id} non trouvé`);
      }

      await this.avisRepository.remove(avis);
      this.logger.log(`Avis supprimé avec succès: ${id}`);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error("Erreur lors de la suppression de l'avis", error);
      throw new InternalServerErrorException("Échec de la suppression de l'avis");
    }
  }
}
