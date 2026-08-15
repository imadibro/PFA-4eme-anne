import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemsPerPage, PaginatedResult } from 'src/common';
import { Repository } from 'typeorm';
import { UserDto } from '../dto/userDto';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async getCurrentUser(id: string): Promise<UserDto> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');

    const userDto = new UserDto(user);

    return userDto;
  }

  async findAll(page: number, limit: number, search: string): Promise<PaginatedResult<UserDto>> {
    try {
      const validLimit = Object.values(ItemsPerPage).includes(limit) ? limit : ItemsPerPage.Ten;

      const [users, total] = await this.userRepository.findAndCount({
        skip: (page - 1) * validLimit,
        take: validLimit,
        order: {
          createdAt: 'DESC'
        }
      });
      const userResponse = users.map(user => new UserDto(user));
      const totalPages = Math.ceil(total / validLimit);
      return { data: userResponse, total, page, limit: validLimit, totalPages };
    } catch (error) {
      this.logger.error('Error while fetching all users', error);
      throw new InternalServerErrorException('Failed to fetch users');
    }
  }

  async findOne(id: string): Promise<UserDto | null> {
    const user = await this.userRepository.findOneBy({ id });
    return user ? new UserDto(user) : null;
  }

  async findByEmail(email: string): Promise<UserDto | null> {
    const user = await this.userRepository.findOneBy({ email });
    return user ? new UserDto(user) : null;
  }

  async update(id: string, user: Partial<User>): Promise<UserDto | null> {
    await this.userRepository.update(id, user);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }

  async verifyAccount(id: string): Promise<UserDto> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    await this.userRepository.update({ id }, { isAccountVerified: true });
    this.logger.log(`Compte vérifié pour l'utilisateur: ${user.username}`);

    const updatedUser = await this.userRepository.findOneBy({ id });
    if (!updatedUser) {
      throw new NotFoundException("Erreur lors de la récupération de l'utilisateur mis à jour");
    }

    return new UserDto(updatedUser);
  }
}
