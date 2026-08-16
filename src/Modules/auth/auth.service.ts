import { BadRequestException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { JWTPayloadType } from '../../common/type/type.js';
import { User } from '../user/entities/user.entity.js';
import { LoginPayload, RegisterPayload } from './payload/register-payload.js';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async register(registerDto: RegisterPayload): Promise<{ accessToken: string }> {
    const existingUserByEmail = await this.userRepository.findOneBy({ email: registerDto.email });

    if (existingUserByEmail) {
      throw new BadRequestException('Un utilisateur avec cet email existe déjà');
    }

    const existingUserByUsername = await this.userRepository.findOneBy({ username: registerDto.username });

    if (existingUserByUsername) {
      throw new BadRequestException("Un utilisateur avec ce nom d'utilisateur existe déjà");
    }

    const hashedPassword = await this.hashPassword(registerDto.password);
    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${registerDto.username}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${registerDto.username}`;

    const defaultProfileImage = registerDto.gender === 'male' ? boyProfilePic : girlProfilePic;
    const userRole = registerDto.userRole || 'TOURISTE';
    const isAccountVerified = userRole === 'TOURISTE' || userRole === 'ADMIN' ? true : false;

    const newUser = this.userRepository.create({
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      gender: registerDto.gender,
      phone: registerDto.phone,
      email: registerDto.email,
      password: hashedPassword,
      username: registerDto.username,
      profileImage: registerDto.profileImage || defaultProfileImage,
      isActive: true,
      isAccountVerified: isAccountVerified,
      userRole: userRole as any
    });

    const savedUser = await this.userRepository.save(newUser);
    this.logger.log(`Nouvel utilisateur créé avec succès: ${savedUser.username}`);

    const sessionToken = this.generateSessionToken();
    await this.userRepository.update(savedUser.id, { sessionToken });

    const payload: JWTPayloadType = {
      id: savedUser.id,
      username: savedUser.username,
      userRole: savedUser.userRole,
      sessionToken
    };
    const accessToken = await this.generateJwt(payload);
    return { accessToken };
  }

  async login(loginPayload: LoginPayload): Promise<{ accessToken: string; refreshToken: string }> {
    const { usernameOrEmail, password } = loginPayload;

    // Déterminer si c'est un email ou un username
    const isEmail = usernameOrEmail.includes('@');

    // Rechercher l'utilisateur par email ou username
    const user = await this.userRepository.findOneBy(
      isEmail ? { email: usernameOrEmail } : { username: usernameOrEmail }
    );

    if (!user || !(await user.validatePassword(password))) {
      throw new UnauthorizedException("Les informations d'identification sont invalides");
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Le compte est désactivé');
    }

    const sessionToken = this.generateSessionToken();
    await this.userRepository.update(user.id, { sessionToken });

    const payload: JWTPayloadType = {
      id: user.id,
      username: user.username,
      userRole: user.userRole,
      sessionToken
    };

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

      if (!user.sessionToken) {
        throw new UnauthorizedException('Session expirée. Veuillez vous reconnecter.');
      }

      const newPayload: JWTPayloadType = {
        id: user.id,
        username: user.username,
        userRole: user.userRole,
        sessionToken: user.sessionToken
      };

      const newAccessToken = await this.jwtService.signAsync(newPayload, {
        secret: this.configService.get('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.get('JWT_ACCESS_EXPIRES_IN')
      });
      return { accessToken: newAccessToken };
    } catch (error) {
      this.logger.error('Refresh error', error);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string) {
    await this.userRepository.update(userId, {
      refreshToken: null,
      sessionToken: null
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

  public async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  private generateSessionToken(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  }
}
