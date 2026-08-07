import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemsPerPage, PaginatedResult } from 'src/common';
import { Repository } from 'typeorm';
import { PackVoyage } from '../../pack-voyage/entities/pack-voyage.entity';
import { Chambre } from '../chambre/entities/chambre.entity';
import { Prestataire } from '../prestataire/entities/prestataire.entity';
import { Touriste } from '../touriste/entities/touriste.entity';
import { Transport } from '../transport/entities/transport.entity';
import { ReservationDto } from './dto/reservation.dto';
import { Reservation } from './entities/reservation.entity';
import { CreateReservationPayload } from './payload/create-reservation.payload';
import { UpdateReservationPayload } from './payload/update-reservation.payload';

@Injectable()
export class ReservationService {
  private readonly logger = new Logger(ReservationService.name);

  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    @InjectRepository(Touriste)
    private readonly touristeRepository: Repository<Touriste>,
    @InjectRepository(Prestataire)
    private readonly prestataireRepository: Repository<Prestataire>,
    @InjectRepository(Chambre)
    private readonly chambreRepository: Repository<Chambre>,
    @InjectRepository(Transport)
    private readonly transportRepository: Repository<Transport>,
    @InjectRepository(PackVoyage)
    private readonly packVoyageRepository: Repository<PackVoyage>
  ) {}

  async findAll(page: number, limit: number, search?: string): Promise<PaginatedResult<ReservationDto>> {
    try {
      const validLimit = Object.values(ItemsPerPage).includes(limit) ? limit : ItemsPerPage.Ten;

      const queryBuilder = this.reservationRepository
        .createQueryBuilder('reservation')
        .leftJoinAndSelect('reservation.touriste', 'touriste')
        .leftJoinAndSelect('touriste.user', 'touristeUser')
        .leftJoinAndSelect('reservation.prestataire', 'prestataire')
        .leftJoinAndSelect('prestataire.user', 'prestataireUser')
        .leftJoinAndSelect('reservation.chambre', 'chambre')
        .leftJoinAndSelect('reservation.transport', 'transport')
        .leftJoinAndSelect('reservation.packVoyage', 'packVoyage');

      if (search) {
        queryBuilder.where('reservation.statut ILIKE :search OR CAST(reservation.montant AS TEXT) ILIKE :search', {
          search: `%${search}%`
        });
      }

      const [reservations, total] = await queryBuilder
        .skip((page - 1) * validLimit)
        .take(validLimit)
        .orderBy('reservation.id', 'DESC')
        .getManyAndCount();

      const reservationResponse = reservations.map(reservation => new ReservationDto(reservation));
      const totalPages = Math.ceil(total / validLimit);

      return { data: reservationResponse, total, page, limit: validLimit, totalPages };
    } catch (error) {
      this.logger.error('Erreur lors de la récupération des réservations', error);
      throw new InternalServerErrorException('Échec de la récupération des réservations');
    }
  }

  async findOne(id: number): Promise<ReservationDto> {
    const reservation = await this.reservationRepository.findOne({
      where: { id },
      relations: {
        touriste: { user: true },
        prestataire: { user: true },
        chambre: true,
        transport: true,
        packVoyage: true
      }
    });

    if (!reservation) {
      throw new NotFoundException(`Réservation avec l'ID ${id} non trouvée`);
    }

    return new ReservationDto(reservation);
  }

  async create(createReservationPayload: CreateReservationPayload): Promise<ReservationDto> {
    try {
      const touriste = await this.touristeRepository.findOne({
        where: { id: createReservationPayload.touristeId },
        relations: { user: true }
      });

      if (!touriste) {
        throw new NotFoundException(`Touriste avec l'ID ${createReservationPayload.touristeId} non trouvé`);
      }

      const prestataire = await this.prestataireRepository.findOne({
        where: { id: createReservationPayload.prestataireId },
        relations: { user: true }
      });

      if (!prestataire) {
        throw new NotFoundException(`Prestataire avec l'ID ${createReservationPayload.prestataireId} non trouvé`);
      }

      let chambre: Chambre | undefined = undefined;
      if (createReservationPayload.chambreId) {
        const foundChambre = await this.chambreRepository.findOne({
          where: { id: createReservationPayload.chambreId }
        });
        if (!foundChambre) {
          throw new NotFoundException(`Chambre avec l'ID ${createReservationPayload.chambreId} non trouvée`);
        }
        chambre = foundChambre;
      }

      let transport: Transport | undefined = undefined;
      if (createReservationPayload.transportId) {
        const foundTransport = await this.transportRepository.findOne({
          where: { id: createReservationPayload.transportId }
        });
        if (!foundTransport) {
          throw new NotFoundException(`Transport avec l'ID ${createReservationPayload.transportId} non trouvé`);
        }
        transport = foundTransport;
      }

      let packVoyage: PackVoyage | undefined = undefined;
      if (createReservationPayload.packVoyageId) {
        const foundPack = await this.packVoyageRepository.findOne({
          where: { id: createReservationPayload.packVoyageId }
        });
        if (!foundPack) {
          throw new NotFoundException(`Pack voyage avec l'ID ${createReservationPayload.packVoyageId} non trouvé`);
        }
        packVoyage = foundPack;
      }

      const newReservation = this.reservationRepository.create({
        touriste,
        prestataire,
        dateReservation: new Date(createReservationPayload.dateReservation),
        dateDebut: new Date(createReservationPayload.dateDebut),
        dateFin: new Date(createReservationPayload.dateFin),
        montant: createReservationPayload.montant,
        statut: createReservationPayload.statut,
        chambre,
        transport,
        packVoyage
      });

      const savedReservation = await this.reservationRepository.save(newReservation);
      this.logger.log(`Nouvelle réservation créée avec succès: ${savedReservation.id}`);

      return this.findOne(savedReservation.id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error('Erreur lors de la création de la réservation', error);
      throw new InternalServerErrorException('Échec de la création de la réservation');
    }
  }

  async update(id: number, updateReservationPayload: UpdateReservationPayload): Promise<ReservationDto> {
    try {
      const reservation = await this.reservationRepository.findOne({
        where: { id },
        relations: { chambre: true, transport: true, packVoyage: true }
      });

      if (!reservation) {
        throw new NotFoundException(`Réservation avec l'ID ${id} non trouvée`);
      }

      if (updateReservationPayload.dateReservation !== undefined) {
        reservation.dateReservation = new Date(updateReservationPayload.dateReservation);
      }

      if (updateReservationPayload.dateDebut !== undefined) {
        reservation.dateDebut = new Date(updateReservationPayload.dateDebut);
      }

      if (updateReservationPayload.dateFin !== undefined) {
        reservation.dateFin = new Date(updateReservationPayload.dateFin);
      }

      if (updateReservationPayload.montant !== undefined) {
        reservation.montant = updateReservationPayload.montant;
      }

      if (updateReservationPayload.statut !== undefined) {
        reservation.statut = updateReservationPayload.statut;
      }

      if (updateReservationPayload.chambreId !== undefined) {
        const chambre = await this.chambreRepository.findOne({ where: { id: updateReservationPayload.chambreId } });
        if (!chambre) {
          throw new NotFoundException(`Chambre avec l'ID ${updateReservationPayload.chambreId} non trouvée`);
        }
        reservation.chambre = chambre;
      }

      if (updateReservationPayload.transportId !== undefined) {
        const transport = await this.transportRepository.findOne({
          where: { id: updateReservationPayload.transportId }
        });
        if (!transport) {
          throw new NotFoundException(`Transport avec l'ID ${updateReservationPayload.transportId} non trouvé`);
        }
        reservation.transport = transport;
      }

      if (updateReservationPayload.packVoyageId !== undefined) {
        const packVoyage = await this.packVoyageRepository.findOne({
          where: { id: updateReservationPayload.packVoyageId }
        });
        if (!packVoyage) {
          throw new NotFoundException(`Pack voyage avec l'ID ${updateReservationPayload.packVoyageId} non trouvé`);
        }
        reservation.packVoyage = packVoyage;
      }

      await this.reservationRepository.save(reservation);
      this.logger.log(`Réservation mise à jour avec succès: ${id}`);

      return this.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error('Erreur lors de la mise à jour de la réservation', error);
      throw new InternalServerErrorException('Échec de la mise à jour de la réservation');
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const reservation = await this.reservationRepository.findOne({ where: { id } });

      if (!reservation) {
        throw new NotFoundException(`Réservation avec l'ID ${id} non trouvée`);
      }

      await this.reservationRepository.remove(reservation);
      this.logger.log(`Réservation supprimée avec succès: ${id}`);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error('Erreur lors de la suppression de la réservation', error);
      throw new InternalServerErrorException('Échec de la suppression de la réservation');
    }
  }

  async findByTouristeUserId(userId: string, page: number, limit: number): Promise<PaginatedResult<ReservationDto>> {
    try {
      const validLimit = Object.values(ItemsPerPage).includes(limit) ? limit : ItemsPerPage.Ten;

      const queryBuilder = this.reservationRepository
        .createQueryBuilder('reservation')
        .leftJoinAndSelect('reservation.touriste', 'touriste')
        .leftJoinAndSelect('touriste.user', 'touristeUser')
        .leftJoinAndSelect('reservation.prestataire', 'prestataire')
        .leftJoinAndSelect('prestataire.user', 'prestataireUser')
        .leftJoinAndSelect('reservation.chambre', 'chambre')
        .leftJoinAndSelect('reservation.transport', 'transport')
        .leftJoinAndSelect('reservation.packVoyage', 'packVoyage')
        .where('touristeUser.id = :userId', { userId });

      const [reservations, total] = await queryBuilder
        .skip((page - 1) * validLimit)
        .take(validLimit)
        .orderBy('reservation.id', 'DESC')
        .getManyAndCount();

      const reservationResponse = reservations.map(reservation => new ReservationDto(reservation));
      const totalPages = Math.ceil(total / validLimit);

      return { data: reservationResponse, total, page, limit: validLimit, totalPages };
    } catch (error) {
      this.logger.error('Erreur lors de la récupération des réservations du touriste', error);
      throw new InternalServerErrorException('Échec de la récupération des réservations');
    }
  }

  async hasTouristeReservedPrestataire(touristeUserId: string, prestataireId: string): Promise<boolean> {
    const reservation = await this.reservationRepository
      .createQueryBuilder('reservation')
      .leftJoin('reservation.touriste', 'touriste')
      .leftJoin('touriste.user', 'touristeUser')
      .leftJoin('reservation.prestataire', 'prestataire')
      .where('touristeUser.id = :touristeUserId', { touristeUserId })
      .andWhere('prestataire.id = :prestataireId', { prestataireId })
      .andWhere('reservation.statut = :statut', { statut: 'CONFIRMEE' })
      .getOne();

    return !!reservation;
  }
}
