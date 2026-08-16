import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { JWTPayloadType } from '../../../common/index';
import { User } from '../../user/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET')
    });
  }

  async validate(payload: JWTPayloadType) {
    const user = await this.userRepository.findOneBy({ id: payload.id });

    if (!user) {
      throw new UnauthorizedException('Utilisateur non trouvé');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Compte désactivé');
    }

    if (!user.sessionToken || user.sessionToken !== payload.sessionToken) {
      throw new UnauthorizedException('Session expirée. Veuillez vous reconnecter.');
    }

    return {
      id: payload.id,
      username: payload.username,
      userRole: payload.userRole
    };
  }
}
