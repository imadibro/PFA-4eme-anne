import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemsPerPage } from 'src/common';
import { Repository } from 'typeorm';
import { UserDto } from '../dto/userDto';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async getCurrentUser(id: string): Promise<UserDto> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');

    const userDto = new UserDto(user);

    return userDto;
  }

  async findAll(
    page: number,
    limit: number,
    search: string
  ): Promise<{ users: UserDto[]; total: number; page: number; totalPages: number }> {
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
      return { users: userResponse, total, page, totalPages };
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

  create(user: Partial<User>): Promise<UserDto> {
    const newUser = this.userRepository.create(user);
    return this.userRepository.save(newUser).then(user => new UserDto(user));
  }

  async update(id: string, user: Partial<User>): Promise<UserDto | null> {
    await this.userRepository.update(id, user);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
