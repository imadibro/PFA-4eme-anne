import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgenceVoyageService } from '../agence-voyage/agence-voyage.service.js';
import { AgenceVoyage } from '../agence-voyage/entities/agence-voyage.entity.js';
import { Guide } from '../guide/entities/guide.entity.js';
import { GuideService } from '../guide/guide.service.js';
import { Hotel } from '../hotel/entities/hotel.entity.js';
import { HotelService } from '../hotel/hotel.service.js';
import { Prestataire } from '../prestataire/entities/prestataire.entity.js';
import { PrestataireService } from '../prestataire/prestataire.service.js';
import { Restaurant } from '../restaurant/entities/restaurant.entity.js';
import { RestaurantService } from '../restaurant/restaurant.service.js';
import { Touriste } from '../touriste/entities/touriste.entity.js';
import { TouristeService } from '../touriste/touriste.service.js';
import { Transport } from '../transport/entities/transport.entity.js';
import { TransportService } from '../transport/transport.service.js';
import { User } from '../user/entities/user.entity.js';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { JwtStrategy } from './strategies/jwt.strategy.js';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_SECRET'),
        signOptions: {
          expiresIn: (configService.get<string>('JWT_ACCESS_EXPIRES_IN') || '24h') as any
        }
      })
    }),
    TypeOrmModule.forFeature([User, Touriste, Prestataire, Hotel, Restaurant, Guide, Transport, AgenceVoyage])
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    TouristeService,
    PrestataireService,
    HotelService,
    RestaurantService,
    GuideService,
    TransportService,
    AgenceVoyageService
  ],
  exports: [AuthService]
})
export class AuthModule {}
