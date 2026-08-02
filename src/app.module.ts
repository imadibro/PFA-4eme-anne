import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard, RolesGuard } from './common';
import { appConfig, databaseConfig, jwtConfig } from './config';
import { AgenceVoyageModule } from './Modules/agence-voyage/agence-voyage.module';
import { AvisModule } from './Modules/avis/avis.module';
import { ChambreModule } from './Modules/chambre/chambre.module';
import { CircuitModule } from './Modules/circuit/circuit.module';
import { GuideModule } from './Modules/guide/guide.module';
import { HotelModule } from './Modules/hotel/hotel.module';
import { PackVoyageModule } from './Modules/pack-voyage/pack-voyage.module';
import { PrestataireModule } from './Modules/prestataire/prestataire.module';
import { ReservationModule } from './Modules/reservation/reservation.module';
import { RestaurantModule } from './Modules/restaurant/restaurant.module';
import { TouristeModule } from './Modules/touriste/touriste.module';
import { TransportModule } from './Modules/transport/transport.module';
import { UserModule } from './Modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, jwtConfig, appConfig]
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: config.get<'postgres'>('database.type'),
        host: config.get<string>('database.host'),
        port: config.get<number>('database.port'),
        username: config.get<string>('database.username'),
        password: config.get<string>('database.password'),
        database: config.get<string>('database.database'),
        synchronize: config.get<boolean>('database.synchronize'),
        logging: config.get<boolean>('database.logging'),
        autoLoadEntities: config.get<boolean>('database.autoLoadEntities')
      })
    }),
    UserModule,
    TouristeModule,
    PrestataireModule,
    ReservationModule,
    AvisModule,
    HotelModule,
    ChambreModule,
    RestaurantModule,
    GuideModule,
    AgenceVoyageModule,
    PackVoyageModule,
    TransportModule,
    CircuitModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    }
  ]
})
export class AppModule {}
