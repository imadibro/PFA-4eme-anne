import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import type { JWTPayloadType } from 'src/common';
import { Repository } from 'typeorm';
import { LoginDto } from '../dto/login.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async login(loginDto: LoginDto): Promise<{ accessToken: string; refreshToken: string }> {
    const { username, password } = loginDto;
    const user = await this.userRepository.findOneBy({ username });
    if (!user || !(await user.validatePassword(password))) {
      throw new UnauthorizedException("Les informations d'identification sont invalides");
    }
    const payload: JWTPayloadType = {
      id: user.id,
      username: user.username,
      userRole: user.userRole
    };
    // TODO: generate tokens
    this.logger.log(`JWT payload: ${JSON.stringify(payload)}`);
    const accessToken = await this.generateJwt(payload);

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN')
    });
    await this.saveRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken };
  }

  async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET')
      });

      const user = await this.userRepository.findOneBy({ id: payload.id });

      if (!user || !user.refreshToken) {
        throw new UnauthorizedException('User not found');
      }

      const isValid = await bcrypt.compare(refreshToken, user.refreshToken);

      if (!isValid) {
        throw new UnauthorizedException();
      }

      const newPayload: JWTPayloadType = {
        id: user.id,
        username: user.username,
        userRole: user.userRole
      };

      const newAccessToken = await this.jwtService.signAsync(newPayload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: this.configService.get('JWT_EXPIRES_IN')
      });
      return { accessToken: newAccessToken };
    } catch (error) {
      this.logger.error('Refresh error', error);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string) {
    await this.userRepository.update(userId, {
      refreshToken: null
    });
  }

  private generateJwt(payload: JWTPayloadType): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  private async saveRefreshToken(userId: string, refreshToken: string) {
    const hashed = await bcrypt.hash(refreshToken, 10);

    await this.userRepository.update(userId, {
      refreshToken: hashed
    });
  }
}
