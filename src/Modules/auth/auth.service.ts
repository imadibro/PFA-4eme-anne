import { BadRequestException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { DataSource, Repository } from 'typeorm';
import { UserRole } from '../../common/enums/role.enum.js';
import { AccessTokenType, JWTPayloadType } from '../../common/type/type.js';
import { User } from '../user/entities/user.entity.js';
import { CompleteRegistrationPayload } from './payload/complete-registration.payload.js';
import { LoginPayload } from './payload/register-payload.js';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource
  ) {}

  async completeRegistration(payload: CompleteRegistrationPayload): Promise<AccessTokenType> {
    return this.dataSource.transaction(async manager => {
      // 0. Validation : au moins touristeInfo OU prestataireInfo doit être fourni
      if (!payload.touristeInfo && !payload.prestataireInfo) {
        throw new BadRequestException(
          'Vous devez fournir soit les informations touriste, soit les informations prestataire'
        );
      }

      if (payload.touristeInfo && payload.prestataireInfo) {
        throw new BadRequestException('Vous ne pouvez pas être à la fois touriste et prestataire');
      }

      // Déduire le rôle automatiquement selon les données fournies
      const isTouriste = !!payload.touristeInfo;
      const userRole = isTouriste ? UserRole.TOURISTE : UserRole.PRESTATAIRE;
      const isAccountVerified = isTouriste; // Touriste vérifié automatiquement, Prestataire nécessite validation admin

      // 1. Créer l'utilisateur
      const existingUserByEmail = await manager.findOne(User, { where: { email: payload.userInfo.email } });
      if (existingUserByEmail) {
        throw new BadRequestException('Un utilisateur avec cet email existe déjà');
      }

      const existingUserByUsername = await manager.findOne(User, {
        where: { username: payload.userInfo.username }
      });
      if (existingUserByUsername) {
        throw new BadRequestException("Un utilisateur avec ce nom d'utilisateur existe déjà");
      }

      const hashedPassword = await this.hashPassword(payload.userInfo.password);
      const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${payload.userInfo.username}`;
      const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${payload.userInfo.username}`;
      const defaultProfileImage = payload.userInfo.gender === 'male' ? boyProfilePic : girlProfilePic;

      const newUser = manager.create(User, {
        firstName: payload.userInfo.firstName,
        lastName: payload.userInfo.lastName,
        gender: payload.userInfo.gender,
        phone: payload.userInfo.phone,
        email: payload.userInfo.email,
        password: hashedPassword,
        username: payload.userInfo.username,
        profileImage: payload.userInfo.profileImage || defaultProfileImage,
        isActive: true,
        isAccountVerified: isAccountVerified,
        userRole: userRole as any
      });

      const savedUser = await manager.save(User, newUser);
      this.logger.log(`Nouvel utilisateur créé avec succès: ${savedUser.username}`);

      const sessionToken = this.generateSessionToken();
      await manager.update(User, savedUser.id, { sessionToken });

      let result: any = { user: savedUser };

      // 2. Créer le profil selon le type (déduit automatiquement)
      if (isTouriste && payload.touristeInfo) {
        // TOURISTE
        const touristeRepository = manager.getRepository('Touriste');
        const newTouriste = touristeRepository.create({
          user: savedUser,
          nationality: payload.touristeInfo.nationality,
          dateNaissance: new Date(payload.touristeInfo.dateNaissance)
        });

        const savedTouriste = await touristeRepository.save(newTouriste);
        this.logger.log(`Nouveau touriste créé avec succès: ${savedTouriste.id}`);
        result.touriste = savedTouriste;
      } else if (payload.prestataireInfo) {
        // PRESTATAIRE
        const prestataireRepository = manager.getRepository('Prestataire');
        const newPrestataire = prestataireRepository.create({
          user: savedUser,
          nomEntreprise: payload.prestataireInfo.nomEntreprise,
          adress: payload.prestataireInfo.adress,
          ville: payload.prestataireInfo.ville,
          localisation: payload.prestataireInfo.localisation,
          categories: payload.prestataireInfo.categories,
          description: payload.prestataireInfo.description
        });

        const savedPrestataire = await prestataireRepository.save(newPrestataire);
        this.logger.log(`Nouveau prestataire créé avec succès: ${savedPrestataire.id}`);
        result.prestataire = savedPrestataire;
      }

      // 4. Générer le token JWT
      const jwtPayload: JWTPayloadType = {
        id: savedUser.id,
        username: savedUser.username,
        userRole: savedUser.userRole,
        sessionToken
      };
      const accessToken = await this.generateJwt(jwtPayload);
      result.accessToken = accessToken;

      return { accessToken };
    });
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
